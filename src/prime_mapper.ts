import { BasicPMEntity, Entry, SubRule } from '../definitions/ui';
import { PrimeMapperMap } from '../definitions/generic';

export interface Ruleable {
	toSubRule(val: number): SubRule;
}

export const primes = require('../../json/primeNumbers.json');

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
