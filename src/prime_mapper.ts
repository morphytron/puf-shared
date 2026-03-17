import { BasicPMEntity, Entry, SubRule } from '../definitions/ui';
import { PrimeMapperMap } from '../definitions/generic';
import { CollectablePM } from './collectable_utils';
import { returnStatement } from '@babel/types';

export interface Ruleable {
	toSubRule(val: number): SubRule;
}

export const primes = require('../json/primeNumbers.json');

export const logBase2 = (value: number): number => {
	if (value / 2 !== 0 && value % 2 === 0) {
		//console.debug('[logBase2()...] calling');
		return logBase2(value / 2) + 1 as number;
	}
	return 0;
};
export const logBase3 = (value: number): number => {
	if (value / 3 !== 0 && value % 3 === 0) {
		//console.debug('[logBase3()...] calling');
		return logBase3(value / 3) + 1 as number;
	}
	return 0;
};

export const deriveThresholdFromValue = (value: number): number => {
	let derivedValue = value;
	for (let prime of primes.primes) {
		//console.debug('prime is', prime);
		while (derivedValue % prime === 0) {
			derivedValue = derivedValue / prime;
		}
	}
	//console.debug("[deriveThresholdFromValue(val)...] Derived threshold value before subtracting one is: " + derivedValue);
	return derivedValue; //subtract one to get actual threshold since we added 1 to prevent lcf of 0.
};

export const getCountOfPrimeKeysInValue = (val: number, prime_key_value: number): number => {
	if (val % prime_key_value === 0) {
		return (
			getCountOfPrimeKeysInValue(val / prime_key_value, prime_key_value) + 1
		);
	} else {
		return 0;
	}
};

export const getPrimeKeyOrderingMap = (entities: BasicPMEntity[]): PrimeMapperMap => {
	//console.log('[getPrimeKeyOrderingMap()] entityArray looks like', entityArray);
	const prime_layout_map: PrimeMapperMap = {};
	let temp_set = new Array();
	entities.forEach((e) => {
		const val = Math.abs(e.key);
		for (let i of temp_set) {
			if (i === val) {
				return;
			}
		}
		temp_set.push(val);
	});
	temp_set = temp_set.sort((a, b) => (a > b ? 1 : -1));
	//console.debug('sorted keys are', temp_set);
	temp_set.forEach((e, i) => {
		prime_layout_map[e] = primes.primes[i];
	});
	return prime_layout_map;
};


export const getCountMapOfIds = (entries: Entry<CollectablePM<any>>[]) : Map<number, number> => {
	var map = new Map();
	entries.forEach((e) => {
		if (map.get(e.data[0].key) || typeof (map.get(e.data[0].key)) === 'number') {
			var val = map.get(e.data[0].key) + 1;
			map.set(e.data[0].key, val);
		} else {
			map.set(e.data[0].key, 0);
		}
	});
	return map;
}

    /**
     * From the first parameter, we can discern how many specific entities (for each) are permissible (in the mappable entity), and how many are deducted if
     * different specific entities are booked once pass the deducible threshold.
     * Second parameter is the count of how many of the specific entities exist currently in the mappable entity.
     * @param rule_layout_map
     * @param count_map_of_ids
     * @return
     */
    public PrimeMappingStatus test_map_is_valid(Map<Integer,Integer> rule_layout_map, Map<Integer, Integer> count_map_of_ids) {
        ArrayList<Integer> ids_list = getIdsFromRuleSet(rule_layout_map);
        AtomicBoolean passesMaxTest = new AtomicBoolean(true);
        AtomicBoolean passesMinTest = new AtomicBoolean(true);
        AtomicBoolean passesOverlapThresholdTest = new AtomicBoolean(true);
        HashMap<Integer, PrimeConstraints> all_constraints_by_id = new HashMap<>();
        //log.debug(String.format("Rule layout map: <%s>", rule_layout_map.toString()));
        rule_layout_map.forEach((key, val) -> {
            if (val == 0) {
                return;  //an invalid entry.  Remove this line once DB is fixed for all layouts.
            }
            int abs_key = Math.abs(key);
            PrimeConstraints primeConstraints = all_constraints_by_id.getOrDefault(abs_key, new PrimeConstraints());
            if (key < 0) {
                //is a min max rule
                int max = getMax(val);
                int min = getMin(val);
                primeConstraints.setMax(max);
                primeConstraints.setMin(min);
            } else if (key > 0) {
                //is a threshold rule
                primeConstraints.setThreshold(getThreshold(val));
                HashMap<Integer, Integer> overlapIdCount = getOverlapIdsCount(val, ids_list);
                primeConstraints.setOverlapIdsCount(overlapIdCount);
            }
            all_constraints_by_id.put(abs_key, primeConstraints);
        });

        for (int id : ids_list) {
            PrimeConstraints constraints = all_constraints_by_id.get(id);
            log.debug(String.format("[constraints for position-#%d] %s", id, constraints.toString()));
            int count = count_map_of_ids.getOrDefault(id, 0);
            if (constraints.getMax() < count) {
                log.debug(String.format("[test_map_is_valid] fails max because max=%d, and count=%d", constraints.getMax(), count));
                passesMaxTest.set(false);
            }
            if (constraints.getMin() > count) {
                log.debug(String.format("[test_map_is_valid] fails min because min=%d, and count=%d", constraints.getMin(), count));
                passesMinTest.set(false);
            }
            int threshold = constraints.getThreshold();
            if (threshold != -1) {
                if (count >= threshold) {
                    //log.debug("Value exceeds threshold, so reducing max equivalent...");
                    AtomicInteger overlapequivelant = new AtomicInteger(0);
                    HashMap<Integer, Integer> overlapids  = constraints.getOverlapIdsCount();
                    overlapids.forEach((overlappingPositionId, overlapCount) -> {
                        float overlap_current_count = count_map_of_ids.getOrDefault(overlappingPositionId, 0);
                        float current_overlap_equiv = overlapequivelant.get();
                        int overlap_equiv = (int) Math.ceil(overlap_current_count / overlapCount)  + (int) current_overlap_equiv;
                        //log.debug(String.format("%d is the overlap equivelant"));
                        overlapequivelant.set(overlap_equiv);   // rounds up.
                    });
                    int result = constraints.getMax() - overlapequivelant.get() - count;
                    //log.debug(String.format("This is the resulting overlap equivelancy (negative is bad and positive or zero is good): <%d>.", result));
                    if (result < 0) {
                        passesOverlapThresholdTest.set(false);
                    }
                    /**
                     do test for the inverse of the threashold/overlap rule entry.
                     aka., when a rule implies for every two half court basketball games, one full court game must be made unavailable and there are one or two
                     half court games playing, then the same must be true if the situation were reversed.  If there was one full court basketball game,
                     then two half-court basketball games must be made unavailable.
                     */
                    //overlapequivelant.set(0);
                    // todo: Finish this part of the algorithm.

                }
            }
        }

        if (passesOverlapThresholdTest.get() && passesMaxTest.get() && passesMinTest.get()) {
            return PrimeMappingStatus.PASSES_ALL;
        } else if (passesMaxTest.get() && passesMinTest.get()) {
            return PrimeMappingStatus.FAILS_OVERLAP_ONLY;
        } else if (passesMaxTest.get() && passesOverlapThresholdTest.get()) {
            return PrimeMappingStatus.FAILS_MIN_ONLY;
        } else if (passesMinTest.get() && passesOverlapThresholdTest.get()) {
            return PrimeMappingStatus.FAILS_MAX_ONLY;
        } else if (passesMaxTest.get()) {
            return PrimeMappingStatus.FAILS_MIN_AND_THRESHOLD;
        } else if (passesMinTest.get()) {
            return PrimeMappingStatus.FAILS_MAX_AND_THRESHOLD;
        } else if (passesOverlapThresholdTest.get()) {
            return PrimeMappingStatus.FAILS_MIN_AND_MAX;
        } else {
            return PrimeMappingStatus.FAILS_ALL;
        }
    }
