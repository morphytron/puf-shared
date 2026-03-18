import { PlayableLocation } from '../definitions/schema';
import { FacilityEvents } from '../definitions/responses';

export const playableLocationHasAJoinable = (location: PlayableLocation): boolean => {

};

export const facilityHasAJoinable = (facility: FacilityEvents) : boolean => {
	return facility.events?.filter(e => e.status === )
};