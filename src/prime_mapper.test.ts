import { expect, test } from 'vitest';
import {
	getCountMapOfIdsByEntryKey,
	getFactorCount,
	getOverlapCountIds,
	logBase2MinCount,
	logBase3MaxCount, strict_test_map_is_valid, test_map_is_valid,
} from './prime_mapper';
import { Entry } from '../definitions/ui';
import { CollectablePM } from './collectable_utils';
import {
	PrimeMapperSport,
} from '../daos/collectibles';
import { PrimeMappingStatus } from '../definitions/generic';

const fakeSportEntries: Entry<CollectablePM<any>>[] = Entry.from([
		new PrimeMapperSport({
			id: 37,
			name: 'Soccer',
		} as any),
		new PrimeMapperSport({
			id: 38,
			name: 'Paddleboarding',
		} as any),
		new PrimeMapperSport({
			id: 38,
			name: 'Paddleboarding',
		} as any),
	], {
		value_key: 'id',
		name_key: 'name',
		is_collectable: true,
	}) as any;


const sport_layout_map = new Map();
sport_layout_map.set(38, 529);
sport_layout_map.set(-37, 81);
sport_layout_map.set(-38, 9);

test('test getFactorCount returns correct values', () => {
	expect(getFactorCount(529, 23)).equals(2);
	expect(getFactorCount(523, 23)).equals(0);
	expect(getFactorCount(23, 23)).equals(1);
});

test('test overlapCountIds returns expected count', () => {
	const sport_layout_map = new Map();
	sport_layout_map.set(38, 529);
	sport_layout_map.set(-37, 81);
	sport_layout_map.set(-38, 9);

	const {
		sortedIds,
		overlapCountIds,
	} = getOverlapCountIds(529, sport_layout_map);
	expect(sortedIds[0]).equals(37);
	expect(sortedIds[1]).equals(38);
	expect(overlapCountIds.get(37)).equals(2);
	expect(overlapCountIds.get(38)).equals(0);
});

test('test entity count from entries works as expected', () => {
	console.debug(fakeSportEntries);
	expect(fakeSportEntries[0].data[0].key).equals(37);
	expect(fakeSportEntries[1].data[0].key).equals(38);

	const countMap = getCountMapOfIdsByEntryKey(fakeSportEntries);
	expect(countMap.get(37)).equals(1);
	expect(countMap.get(38)).equals(2);
});

test('test min count and max counts work', () => {
	expect(logBase2MinCount(324)).equals(2);
	expect(logBase3MaxCount(324)).equals(4);
});

test('test_map_is_valid works as expected', () => {

	// test #1 fails overlap/threshold only because there are two 38 type ids,
	// and the rules allow for just 2 max, but there is also one 37 id, and
	// since the threshold is 1, and for every two 37-type entities, one will
	// be deducted from the total (rounded up), the threshold has been passed
	// already since are two 38's.
	const count_of_entity_ids = getCountMapOfIdsByEntryKey(fakeSportEntries);
	let primeMappingStatus = test_map_is_valid(sport_layout_map, count_of_entity_ids);
	console.debug('primeMappingStatus', primeMappingStatus);
	expect(primeMappingStatus).equals(PrimeMappingStatus.FAILS_OVERLAP_ONLY);

	// test #2 fails max test and threshold.
	count_of_entity_ids.set(38,3);
	primeMappingStatus = test_map_is_valid(sport_layout_map, count_of_entity_ids);
	console.debug('primeMappingStatus', primeMappingStatus);
	expect(primeMappingStatus).equals(PrimeMappingStatus.FAILS_MAX_AND_THRESHOLD);

	// test #3 fails min test and threshold.
	const sport_rule_copy = new Map(sport_layout_map);
	//add a min rule that states entity id 37 must have a minimum of 2
	// entities present.
	sport_rule_copy.set(-37, sport_rule_copy.get(-37) * 2 * 2);
	count_of_entity_ids.set(38,2); // put it back to just 2.
	console.debug('sport_rule_copy', sport_rule_copy);
	primeMappingStatus = test_map_is_valid(sport_rule_copy, count_of_entity_ids);
	console.debug('primeMappingStatus', primeMappingStatus);
	expect(primeMappingStatus).equals(PrimeMappingStatus.FAILS_MIN_AND_THRESHOLD);
});

test('strict_test_map_is_Valid works as expected', () => {
	const count_of_entity_ids = getCountMapOfIdsByEntryKey(fakeSportEntries);
	//insert random key that is not in ruleset.
	count_of_entity_ids.set(49, 1);
	const primeMappingStatus = strict_test_map_is_valid(sport_layout_map, count_of_entity_ids);
	expect(primeMappingStatus).equals(PrimeMappingStatus.EXTRA_ENTITY_ID_NOT_FOUND_IN_RULE_MAP);
});