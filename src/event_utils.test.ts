import { expect, test, assert } from 'vitest'
import {
	getOverlapIdMapFromDateRangeObjArray,
	overlaps,
} from '../src/event_utils';
import { strict_test_map_is_valid } from './prime_mapper';
import { PrimeMappingStatus } from '../definitions/generic';

test('overlaps works', () => {
	expect(overlaps({start: 1, end: 2}, {start: 2, end: 3})).true;
	expect(overlaps({start: 1, end: 2}, {start: 3, end: 4})).false;
	//partial overlaps
	expect(overlaps({start: 1, end: 2}, {start: 1.5, end: 3})).true;
	expect(overlaps({start: 1, end: 2}, {start: 0, end: 1.5})).true;
	// inclusive tests
	expect(overlaps({start: 1, end: 2}, {start: 0, end: 1})).true;
	expect(overlaps({start: 1, end: 2}, {start: 2, end: 3})).true;
	// inside or inclusive inside.
	expect(overlaps({start: 1, end: 2}, {start: 1, end: 2})).true;
	expect(overlaps({start: 1, end: 2}, {start: 1.5, end: 1.75})).true;
});


test('getOverlapIdMapFromDateRangeObjArray works', () => {
	let tempMap = getOverlapIdMapFromDateRangeObjArray([
		{
			id: 1,
			start: 1,
			end: 2
		},{
			id: 1,
			start: 1,
			end: 2
		}
	]);
	expect(tempMap.get(1)).toBe(2);
	tempMap = getOverlapIdMapFromDateRangeObjArray([
		{
			id: 1,
			start: 1,
			end: 2
		},{
			id: 1,
			start: 1,
			end: 2
		},{
			id: 2,
			start: 2,
			end: 3
		}
	]);
	expect(tempMap.get(1)).toBe(2);
	expect(tempMap.get(2)).toBe(1);
});

test('getUserOperabilityOfFacility', () => {
	let tempMap = getOverlapIdMapFromDateRangeObjArray([
		{
			id: 1,
			start: 1,
			end: 2
		},{
			id: 1,
			start: 1,
			end: 2
		},{
			id: 2,
			start: 1,
			end: 2
		}
	]);
});