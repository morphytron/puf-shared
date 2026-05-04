import { FacilityEvents } from '../definitions/responses';
import {
	EventAndEventMemberIds, EventStatus,
	SportRules,
	UserEvent,
} from '../definitions/schema';
import { RuleSetUtil } from './collectable_utils';
import { strict_test_map_is_valid } from './prime_mapper';
import { PrimeMappingStatus } from '../definitions/generic';


export const convertUserEventToEventAndEventMemberIds = (ue: UserEvent): EventAndEventMemberIds => {
	const uids : number[] = [];
	const uids_and_teams : string[] = ue.eventuidsandteamids.split(";");
	uids_and_teams.forEach(uidtids => {
		const [ uid, teamid ] = uidtids.split(",");
		uids.push(Number(uid));
	});
	return {
		addedbyuid: ue.addedbyuid,
		age_group: ue.age_group,
		coed_or_gender: ue.coed_or_gender,
		dt_created: ue.dt_created,
		event_member_ids: uids,
		facilityid: ue.facilityid,
		id: ue.id,
		is_quickmatch: ue.is_quickmatch,
		lastchangedon: ue.lastchangedon,
		placeid: ue.placeid,
		rulesid: ue.rulesid,
		sportid: ue.sportid,
		sportname: ue.sportname,
		status: ue.estatus as EventStatus,
		timeends: ue.timeends,
		timefinished: ue.timefinished,
		timestarts: ue.timestarts
	}
}

export enum UserOperability {
	USER_CAN_CREATE_EVENT_ONLY,
	USER_CAN_JOIN_EVENT_ONLY,
	USER_CAN_CREATE_AND_JOIN_EVENTS,
	USER_CANNOT_CREATE_OR_JOIN_EVENTS
}

/**
 * This will return separate groups or clusters of entities that all overlap
 * each other, and it will break of single events into separate groups if
it changes the number of overlaps for that segment of time.  While it is
 unrealistic to breakup events into separate groups, it does not make sense
 to prevent events or entities from being scheduled if there is some segment
 of time that not all elements are overlapping each other.
 * @param tempArray
 */
export const get_overlap_groups =  (tempArray: {start: number, end: number, id? : number}[]): {allOverlaps: boolean,
	groups: Array<Array<{id?: number,
	start: number, end:number}>>} => {
	const groups = new Array<Array<{id?: number, start: number, end: number}>>();
	let aGroup = new Array<{id? : number, start:number, end: number}>();
	let allOverlaps = true;
	for (let a = 0; a < tempArray.length; a +=2) {
		const itema = tempArray[a];
		let overlaps_ = true;
		aGroup.push(itema);
		inner:
		for (let b = a + 1; b + a <tempArray.length; b +=2) {
			const itemb = tempArray[b];
			overlaps_ = overlaps_ && overlaps(itema, itemb);
			allOverlaps = allOverlaps && overlaps_;
			if (!overlaps_) {
				groups.push(aGroup.slice());
				aGroup = new Array();
				break inner;
			} else {
				aGroup.push(itemb);
			}
		}
	}
	//now that we have these separated groups, we must divide these groups
	// into pseudo-partial entities so that each start-end segment overlaps 100%.
	groups.forEach(group => {
		for (let a = 0; a < group.length; a+= 2) {
			const a_ = group[a];
			let reference_point_a = a_.start;
			const partial_group = new Array<{id? : number, start: number, end: number}>();
			for (let b = a + 1; b + a < group.length; b += 2) {
				const b_ = group[b];
				if (!(b_.start <= reference_point_a  && reference_point_a <= b_.end)) {
					partial_group.push({start: reference_point_a, id: a_.id, end: b_.end});
				}
			}
		}
	});
	return {allOverlaps, groups};
}

//export const

export const overlaps = (a: { start: number, end: number }, b: {
	start: number,
	end: number
}): boolean => {
	return (a.start <= b.end && a.end >= b.end) ||
		(a.start >= b.start && a.end <= b.end) ||
		(a.start <= b.start && a.end >= b.end) ||
		(a.start <= b.start && a.end >= b.start);
};


/**
 * Note: Assumes array is only of overlapping entities due to daterange
 * overlapping with other entities.
 * When an entity overlaps on a calendar spread, for this
 * group, create
 * a map of entity ids to their respective counts.
 * @param tempArrayOfOverlappingEntities
 */
export const getOverlapIdMapFromDateRangeObjArray = (tempArrayOfOverlappingEntities: Array<{
	id: number,
	start: number,
	end: number
}>): Map<number, number> => {
	const overlappingIds = new Map<number, number>();
	tempArrayOfOverlappingEntities.forEach(el => {
		const count = overlappingIds.get(el.id);
		if (typeof (count) === 'number') {
			overlappingIds.set(el.id, count + 1);
		} else {
			overlappingIds.set(el.id, 1);
		}
	});
	return overlappingIds;
};



/**
 * A joinable means that there is an event that already is created or
 * pending.  This check also checks for whether a user can create an
 * event--this assumes the user can create an event with high enough tier
 * (Silver or above)
 * @param facilityEvents
 * @param dateRange
 */
export const getUserOperabilityOfFacility = (sportId: number, sportRules: SportRules, facilityEvents: FacilityEvents, dateRange?: {
	start: Date,
	end: Date
}): UserOperability => {
	let filteredEvents = facilityEvents.events?.filter(e =>
		(e.sportid === sportId && e.rulesid === sportRules.id) && (e.status === 'CREATED' || e.status === 'PENDING'));
	let allEvents = facilityEvents.events ? facilityEvents.events : [];
	if (filteredEvents.length > 0) {
		const startToEndArray = new Array<{
			start: number,
			end: number,
			id: number
		}>();
		if (dateRange) {
			allEvents.forEach(e => {
				const start = new Date(e.timestarts).getTime();
				const end = new Date(e.timeends).getTime();
				startToEndArray.push({ start, end, id: e.sportid });
			});
			startToEndArray.sort((a, b) => {
				if (a.start < b.start) {
					return 1;
				} else if (a.start === b.start) {
					return 0;
				} else {
					return -1;
				}
			});
		}
		//milli seconds
		const duration = sportRules.duration_in_seconds * 100;
		let tempArrayOfOverlappingEvents = new Array<{
			id: number,
			start: number,
			end: number
		}>();
		const prime_map_layout_obj = RuleSetUtil.getRuleSet_FacilitySports(facilityEvents.facility);
		for (let i = 0; i + 1 < startToEndArray.length; i += 2) {
			const a = startToEndArray[i];
			const b = startToEndArray[i + 1];
			if (a.end + duration < b.start) {
				//it does not overlap.
				return UserOperability.USER_CAN_CREATE_AND_JOIN_EVENTS;
			} else {
				//it overlaps.
				const priorIndex = i - 1;
				if (priorIndex >= 1) {
					const priorEve = tempArrayOfOverlappingEvents[priorIndex];
					// check previous iteration if it overlapped before and use it as
					// reference.
					if (overlaps(priorEve, a)) {
						tempArrayOfOverlappingEvents.push(b);
					} else {
						// if the prior event does not overlap with a, then we create a
						// new rule test since this is a separate group.
						// However, we must clear do a rule check before clearing out the
						// array
						const overlappingIds = getOverlapIdMapFromDateRangeObjArray(tempArrayOfOverlappingEvents);
						//add the proposed sportId
						const count = overlappingIds.get(sportId);
						if (typeof (count) === 'number') {
							overlappingIds.set(sportId, count + 1);
						} else {
							overlappingIds.set(sportId, 1);
						}
						//do test
						const result = strict_test_map_is_valid(RuleSetUtil.getRuleSet_FacilitySports(facilityEvents.facility), overlappingIds);
						console.debug(`Got ${result.toString()} for group: ${tempArrayOfOverlappingEvents}`);
						if (result === PrimeMappingStatus.PASSES_ALL) {
							return UserOperability.USER_CAN_CREATE_AND_JOIN_EVENTS;
						}
						// clear out phase.
						tempArrayOfOverlappingEvents = new Array();
						// fill for next iteration
						tempArrayOfOverlappingEvents.push(a);
						tempArrayOfOverlappingEvents.push(b);
					}
				} else {
					tempArrayOfOverlappingEvents.push(a);
					tempArrayOfOverlappingEvents.push(b);
				}
			}
		}
		// check for any left-over elements in tempArray and do rule check.
		if (tempArrayOfOverlappingEvents.length > 0) {
			const overlappingIds = getOverlapIdMapFromDateRangeObjArray(tempArrayOfOverlappingEvents);
			const result = strict_test_map_is_valid(prime_map_layout_obj, overlappingIds);
			console.debug(`Got ${result.toString()} for group: ${tempArrayOfOverlappingEvents}`);
			if (result === PrimeMappingStatus.PASSES_ALL) {
				return UserOperability.USER_CAN_CREATE_AND_JOIN_EVENTS;
			}
		}
		return UserOperability.USER_CAN_JOIN_EVENT_ONLY;
	} else if (dateRange && sportRules.duration_in_seconds * 100 < (dateRange.end.getTime() - dateRange.start.getTime())) {
		return UserOperability.USER_CAN_CREATE_EVENT_ONLY;
	}
	return UserOperability.USER_CANNOT_CREATE_OR_JOIN_EVENTS;
};
