import { FacilityEvents } from '../definitions/responses';

export const facilityHasAJoinable = (facility: FacilityEvents) : boolean => {
	return facility.events?.filter(e => e.status === 'CREATED' || e.status === 'PENDING').length > 0;
};