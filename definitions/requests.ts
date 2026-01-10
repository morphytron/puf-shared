import {PriceMeta} from "./stripe";
import {Query, QueryInfo} from "../src/querying";

export type ForumLookup = {
    badgesdetermined: boolean;
    uid: number;
}
export interface NotificationT  {
    notificationType: string,
    recipientUserIds: number[] | null,
    recipientUserDevices: string[] | null,
    eventId: number | null,
    requesterFirstName: string | null,
    requesterLastName: string | null,
    supercede_user_preferences : boolean | null,
    table_name: string | null,
    table_key : number | null,
    phoneNumbers : string[] | null,
    emailAddresses: string[] | null,
    timezone_minute_offset: number | null
}

export interface Verification {
    table_name: string;
    table_key: number;
    is_email_verify: boolean;
    is_phone_verify: boolean;
    phone_number: string;
    email_address: string;
    timezone_minute_offset: number;
    supercede_user_preferences: boolean;
}

export enum CrudType {
  Delete='delete', Create='post', Update='patch', Read='get'
}

export type QueryType = {
    table_name: string;
    operator_connectors: string[][];
    page_info : QueryInfo | null;
}
export type FilterLocationRequest = {
    filter: Query;
    location: LocationRequest;
}
export type LocationRequest = {
    radius: number;
    lat: number;
    long: number;
}
export type DateRange = {
    start: string | Date; // uses datetime utc
    end : string | Date; // uses datetime utc
}
export type FilterableAtlasRequest = {
    latLngRadius : LocationRequest;
    uid: number;
    dateRange: DateRange;
};

export type QueryInfo_ = {
    offset: number,
    limit: number,
    ordered_by: string[],
    asc: boolean
}
/**
 * a = Athlete, p = Professional
 */
export type QmQMode = 'a' | 'p';

export type QmQEntryRequest = {
    age : number;
    gender: 'f' | 'm';
    uid: number;
    un: string;
    /// for joining manually
    eventId?: number;
    sportId: number;
    goodForUntil: string;
    rulesId: number;
    orderedPositionChoices: number[];
    radius: number;
    mode: QmQMode;
    lat: number;
    lng: number;
    teamId?: number;
    flexibleAgeGroup: boolean;
    flexibleCoed: boolean;
    canEventRun : boolean;
    minFacilityReviewAvg: number;
    preferSurface: boolean;
    preferPositionChoice: boolean;
    preferPlType: boolean;
    isFlexible :boolean;
    isPreferShortDriving: boolean;
    useSurfaces: string[];
    usePlTypes: string[];
    isTrainer: boolean;
    isPlayer: boolean;
    isReferee: boolean;
    isCoach: boolean;
    isInstructor: boolean;
    moneyContributed: boolean;
    prefersStandby: boolean;
    /// for manual creation
    placeId? : number;
    /// for manual creation
    facilityId?: number;
    /// for manual creation
    exactStartTime?: string;
}

export type DeleteEventsBatchOptions = {
	uid: number;
	un: string;
	removeFromAllFutureEvents: boolean;
	removeFromProperties: boolean; // if this is true, then rulesid, age,
	// gender cannot be null, otherwise they can be.
	eventid? : number; // if it is a single event.
	gender?: string;
	age?: number;
	rulesid? : number;
}


export type SessionRequest = {
    uid: number;
    customer_id: string;
    sessionId: string | null;
    priceIdList : Array<PriceMeta>;
}
