import { Entry, SubRule } from '../definitions/ui';
import { PrimeMappingStatus } from '../definitions/generic';
import { CollectablePM, PrimeConstraint } from './collectable_utils';

const primes = [23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313];
export interface Ruleable {
	toSubRule(val: number): SubRule;
}



/**
 * This gets the min value from a multi-factored value.
 * @param value
 */
export const logBase2MinCount = (value: number): number => {
	if (value % 2 === 0) {
		return logBase2MinCount(value / 2) + 1 as number;
	}
	return 0;
};

/**
 * This gets the max value from a multi-factored value.
 * @param value
 */
export const logBase3MaxCount = (value: number): number => {
	if (value % 3 === 0) {
		return logBase3MaxCount(value / 3) + 1 as number;
	}
	return 0;
};

export const deriveThresholdFromValue = (value: number): number => {
	let derivedValue = value;
	for (let prime of primes) {
		while (derivedValue % prime === 0) {
			derivedValue = derivedValue / prime;
		}
	}
	return derivedValue; //subtract one to get actual threshold since we added 1 to prevent lcf of 0.
};


/**
 * Get the count of primekeys in value.  If the prime_key_value is negative,
 * then it an error is thrown as that would indicate it is a min-max
 * calculation.
 * @param val
 * @param prime_key_value
 */
export const getCountOfPrimeKeysInValue = (val: number, prime_key_value: number): number => {
	if (prime_key_value < 0) throw new Error('Prime_key_value cannot be' +
		' negative, as that would indicate it is a min-max calculation.');
	if (val % prime_key_value === 0) {
		return (
			getCountOfPrimeKeysInValue(val / prime_key_value, prime_key_value) + 1
		);
	} else {
		return 0;
	}
};

/**
 * Returns the map of prime numbers to its corresponding entity id, the
 * former of which
 * would be used in values
 * Note: unsorted-ids array must be all positive and must be unique.
 * @param ids
 */
export const getPrimeKeyOrderingMapAndSortedIdsFromUnsortedIds = (ids: Array<number>): {
	sortedIds: number[],
	primeLayoutMap: Map<number, number>
} => {
	const prime_layout_map = new Map<number, number>();
	ids = ids.filter(e => e >= 0).sort((a, b) => (a > b ? 1 : -1));
	ids.forEach((e, i) => {
		prime_layout_map.set(primes[i], e);
	});
	console.debug('getPrimeKeyOrderingMapFromUnsortedIds result.', prime_layout_map);
	return { sortedIds: ids, primeLayoutMap: prime_layout_map };
};

/**
 * Returns the map of entity-id keys to the corresponding prime number that
 * would be used in values.
 * Note: unlike
 * getPrimeKeyOrderingMapAndSortedIdsFromUnsortedIds(...) method, the rules
 * map can have positive or negative entity ids.
 * @param rule_map
 */
export const getPrimeKeyOrderingMapFromRuleMap = (rule_map: Map<number, number>): {
	sortedIds: number[],
	primeLayoutMap: Map<number, number>
} => {
	const temp_set = new Set();
	rule_map.forEach((key) => {
		const val = Math.abs(key);
		temp_set.add(val);
	});
	const arr = Array.from(temp_set) as number[];
	return getPrimeKeyOrderingMapAndSortedIdsFromUnsortedIds(arr);
};


/**
 * Returns the actual count of each entity id in the entries as a map by
 * each individual entity.
 * The key is used to get the entity id.
 * @param entries
 */
export const getCountMapOfIdsByEntryKey = (entries: Entry<CollectablePM<any>>[]): Map<number, number> => {
	const map = new Map();
	entries.forEach((e) => {
		let entity = e.data[0];
		if (map.get(entity.key) || typeof (map.get(entity.key)) === 'number') {
			let val = map.get(entity.key) + 1;
			map.set(entity.key, val);
		} else {
			map.set(entity.key, 1);
		}
	});
	return map;
};


/**
 * Returns an unsorted list of entity ids from a ruleset.
 * @param ruleset
 */
export const getUnsortedIdsFromRuleObjectMap = (ruleset: {
	[keys: string | number]: number
}): Array<number> => {
	const arr = new Array();
	const keySet = new Set();
	Object.keys(ruleset).forEach((k, i) => {
		const ke = Number(k);
		keySet.add(Math.abs(ke));
	});
	return arr;
};


/**
 * Returns an unsorted list of entity ids from a pre-built JS map.
 * @param ruleset
 */
export const getUnsortedIdsFromRuleMap = (ruleset: Map<number | string, number>): Array<number> => {
	const arr = new Array();
	const keySet = new Set();
	ruleset.keys().forEach((k, i) => {
		const ke = Number(k);
		keySet.add(Math.abs(ke));
	});
	return arr;
};


export const getFactorCount = (value: number, factorial: number): number => {
	if (value % factorial === 0) {
		return getFactorCount(value / factorial, factorial) + 1;
	} else {
		return 0;
	}
};


/**
 * Use this function if the key is positive, and it will return a
 * map of counts for each id that is in the value to its corresponding
 * positive key.* Note: this
 * function does not calculate whether existing entities are passing the
 * threshold, or, whether the proposed rule_layout_map is valid.
 * @param value
 * @param rule_layout_map
 */
export const getOverlapCountIds = (value: number, entityIdCounts: Map<number, number>): {
	sortedIds: number[],
	overlapCountIds: Map<number, number>
} => {
	const map = new Map<number, number>();
	let arr = entityIdCounts.keys().toArray();
	const set = new Set();
	arr.forEach((e) => {
		set.add(Math.abs(e));
	});
	arr = Array.from(set) as number[];
	const {
		sortedIds,
		primeLayoutMap,
	} = getPrimeKeyOrderingMapAndSortedIdsFromUnsortedIds(arr);
	console.debug('primeLayoutMap + size', primeLayoutMap, primeLayoutMap.size);
	for (let i = 0; i < primeLayoutMap.size; i++) {
		console.debug('value + primes[i]', value, primes[i]);
		const count = getFactorCount(value, primes[i]);
		console.debug(`Factor count=${count} for id=${sortedIds[i]}`);
		map.set(sortedIds[i], count);
	}
	console.debug('getOverlapCountIds result', map);
	return { sortedIds: sortedIds, overlapCountIds: map };
};


/**
 * This will check whether the proposedCountOfIds is valid for the ruleMap.
 * If there is an extra entity id not found on the rule map, then it will
 * return a EXTRA_ENTITY_ID_NOT_FOUND_IN_RULE_MAP error, otherwise, it will
 * test the map for validity.
 * @param ruleMap
 * @param proposedCountOfIds
 */
export const strict_test_map_is_valid = (ruleMap: Map<number, number>, proposedCountOfIds: Map<number, number>): PrimeMappingStatus => {
	for (let key of proposedCountOfIds.keys()) {
		if (!ruleMap.has(key)) {
			return PrimeMappingStatus.EXTRA_ENTITY_ID_NOT_FOUND_IN_RULE_MAP;
		}
	}
	return test_map_is_valid(ruleMap, proposedCountOfIds);
}


/**
 * For a given entity id, check whether the existing or proposed count of
 * ids would exceed the threshold and if it does, then check whether the
 * result exceeds the constraints.  Returns false if result is negative
 * (fails check) and true if it passes.
 * @param entityId
 * @param constraint
 * @param proposedCountOfIds
 */
export const passes_threshold_test = (entityId: number, constraint : PrimeConstraint, proposedCountOfIds : Map<number, number>) : {passes: boolean, result: number}  => {
	const threshold = constraint.threshold;
	const count = proposedCountOfIds.get(entityId) || 0;
	let result = count;
	if (threshold != -1) {
			if (count >= threshold) {
				console.debug('Value exceeds threshold, so reducing max equivalent...');
				let overlapequivelant = 0;
				const overlapIdsMap = constraint.overlapIdsCount;
				overlapIdsMap.entries().forEach(([overlappingPositionId, overlapCount]) => {
					let overlap_current_count = proposedCountOfIds.get(overlappingPositionId) || 0;
					console.debug('[overlappingPositionId, overlapCount,' +
						' overlap_current_count]',[overlappingPositionId, overlapCount, overlap_current_count]);
					///important! // Rounds up
					if (overlapCount !== 0) overlapequivelant = Math.ceil(overlap_current_count / overlapCount) + overlapequivelant;
				});
				result = constraint.max - overlapequivelant - count;
				console.debug('This is the resulting overlap' +
					' equivelancy (negative is bad and positive or zero is good): ' + result + '.');
				if (result < 0) {
					return {passes: false, result: result};
				}
			}
		}
	return {passes: true, result: result};
};
/**
 * Returns a map of all constraints by entity id.
 * @param ruleMap
 * @param proposedCountOfIds
 */
export const get_all_constraints_by_id = (ruleMap : Map<number, number>, proposedCountOfIds: Map<number,  number>): Map<number, PrimeConstraint> => {
	const all_constraints_by_id = new Map<number, PrimeConstraint>();
	ruleMap.entries().forEach(([key, value]) => {
		if (value === 0) {
			return;
		}
		const abs_key = Math.abs(key);
		let primeConstraint = all_constraints_by_id.get(abs_key);
		if (!primeConstraint) {
			primeConstraint = new PrimeConstraint();
			all_constraints_by_id.set(abs_key, primeConstraint);
		}
		if (key < 0) {
			// It is a min-max rule
			const min = logBase2MinCount(value);
			const max = logBase3MaxCount(value);
			primeConstraint.max = max;
			primeConstraint.min = min;
		} else {
			// it is a threshold rule
			primeConstraint.threshold = deriveThresholdFromValue(value);
			primeConstraint.overlapIdsCount = getOverlapCountIds(value, proposedCountOfIds).overlapCountIds;
		}
	});
	return all_constraints_by_id;
};
/**
 * The proposedCountOfIds has a count of each id in the current system.  If
 * it violates any rules set forth by the ruleMap, then a fail error is
 * returned, if not: PASSES_ALL.  Note: this does not check whether
 * proposedCountOfIds keys match the ruleMap keys.  For that check, use strict_test_map_is_valid.
 */
export const test_map_is_valid = (ruleMap: Map<number, number>, proposedCountOfIds: Map<number, number>): PrimeMappingStatus => {
	const ruleIds = getUnsortedIdsFromRuleMap(ruleMap);
	let passesMaxTest = true;
	let passesMinTest = true;
	let passesOverlapThresholdTest = true;
	const ids_list = proposedCountOfIds.keys().toArray().filter(val => val >= 0).sort((a, b) => (a > b ? 1 : -1));
	console.debug('ids_list in test_map_is_valid', ids_list);
	const all_constraints_by_id = get_all_constraints_by_id(ruleMap, proposedCountOfIds);
	for (let id of ids_list) {
		const constraint: PrimeConstraint = all_constraints_by_id.get(id);
		console.debug('[constraints for entity-' + id, constraint);
		const count = proposedCountOfIds.get(id) || 0;
		if (constraint.max < count) {
			console.debug(`[test_map_is_valid] fails max because max=${constraint.max}, and count=${count}`);
			passesMaxTest = false;
		}
		if (constraint.min > count) {
			console.debug(`[test_map_is_valid] fails min because min=${constraint.min}, and count=${count}`);
			passesMinTest = false;
		}
		passesOverlapThresholdTest &&= passes_threshold_test(id, constraint, proposedCountOfIds).passes;
	}
	if (passesOverlapThresholdTest && passesMaxTest && passesMinTest) {
		return PrimeMappingStatus.PASSES_ALL;
	} else if (passesMaxTest && passesMinTest) {
		return PrimeMappingStatus.FAILS_OVERLAP_ONLY;
	} else if (passesMaxTest && passesOverlapThresholdTest) {
		return PrimeMappingStatus.FAILS_MIN_ONLY;
	} else if (passesMinTest && passesOverlapThresholdTest) {
		return PrimeMappingStatus.FAILS_MAX_ONLY;
	} else if (passesMaxTest) {
		return PrimeMappingStatus.FAILS_MIN_AND_THRESHOLD;
	} else if (passesMinTest) {
		return PrimeMappingStatus.FAILS_MAX_AND_THRESHOLD;
	} else if (passesOverlapThresholdTest) {
		return PrimeMappingStatus.FAILS_MIN_AND_MAX;
	} else {
		return PrimeMappingStatus.FAILS_ALL;
	}
};

/**
				 do test for the inverse of the threashold/overlap rule entry.
				 aka., when a rule implies for every two half court basketball games, one full court game must be made unavailable and there are one or two
				 half court games playing, then the same must be true if the situation were reversed.  If there was one full court basketball game,
				 then two half-court basketball games must be made unavailable.
 */
//overlapequivelant.set(0);
// todo: Finish this part of the algorithm.
/*
                }
            }
	}
}

    /**
     * From the first parameter, we can discern how many specific entities (for each) are permissible (in the mappable entity), and how many are deducted if
     * different specific entities are booked once pass the deducible threshold.
     * Second parameter is the count of how many of the specific entities exist currently in the mappable entity.
     * @param rule_layout_map
     * @param count_map_of_ids
     * @return
     */
/*
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
/*
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
*/