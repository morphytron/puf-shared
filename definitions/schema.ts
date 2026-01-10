import { Collectable } from '../src/collectable_utils';

export type Invite = {
    tablekey: number;
    tablename: string;
    dt_created: string;
    dt_expires: string | null;
    inviter: number;
    invitee: number;
    topic: string;
    id: number;
};
export type Vote = {
    id : number;
    vote_session_id: number;
    voter_uid: number;
    votee_uid: number;
};
export type VoteSessionVotesEventMembers = {
  vote_session: VoteSessionAndEumIdsAndVoteIds;
  event_user_members: EventUserMember[];
  votes: null | Vote[];
};
/**
 * pub id: i32,
 *         pub onstandby: bool,
 *         pub anypositionlastresort: bool,
 *         pub athletetier: i16,
 *         pub position_choices: Vec<i32>,
 *         pub dt_created: Option<DateTimeUtc>,
 *         pub eventid: i32,
 *         pub uid: i32,
 *         pub iscoach: bool,
 *         pub istrainer: bool,
 *         pub isreferee: bool,
 *         pub isinstructor: bool,
 *         pub iseventrunner: bool,
 *         pub moneycontributed: bool,
 *         pub position_: i32,
 *         pub scoreifrel: Option<i32>,
 *         pub won: Option<bool>,
 *         pub checkedin: Option<bool>,
 */
export type EventUserMember = {
		id: number;
		teamid: number;
    onstandby: boolean;
    anypositionlastresort: boolean;
    athletetier: number;
    position_choices: number[];
    dt_created: null | string;
    eventid: number;
    uid: number;
    iscoach: boolean;
    istrainer: boolean;
    isreferee:  boolean;
    isinstructor: boolean;
    iseventrunner: boolean;
    moneycontributed: boolean;
    position : number;
    scoreifrel: null | number;
    won: null | boolean;
    checkedin: null | boolean;
};
/**
 * pub uid: i32,
 *         pub id: i32,
 *         pub topic: String,
 *         pub event_id: i32,
 *         pub dt_created: DateTime<Utc>,
 *         pub dt_expires: DateTime<Utc>,
 *         pub sportid: i32,
 *         pub teamid: i32,
 *         pub rulesid: i32,
 *         pub vote_ids: Vec<i32>,
 *         pub event_user_member_ids: Vec<i32>,
 */
export type VoteSessionAndEumIdsAndVoteIds = {
		id: number;
    uid: number;
    topic: string;
    event_id: number;
    dt_created: string;
    dt_expires: string;
    sportid: number;
    teamid: number;
    rulesid: number;
    vote_ids: number[];
    event_user_member_ids: number[];
};
export type Account = {
    id : number;
    uid: number;
    isactive : boolean;
    athletetier: number;
    nextpaymentdayofmonth: number;
    freeuntil: string;
    firstpaymenton: string;
    payrate: number;
    coinpoints: number;
    stripecustomerid: string;
    roles: string;
};

export type User = {
    profilemeta: Object;
    id: number,
    un: string,
    pw: string,
    status : string,
    emailaddress:string,
    lookingfortrainer: boolean;
    lookingforcoach: boolean;
    lookingforteam: boolean;
    phonenumber: string;
    datejoined: string;
    firstname: string;
    lastname: string;
    middlename: string | null;
    isfemale: boolean;
    lastloggedin: string;
    birthdate: string;
    bronzemedalsawarded: number;
    silvermedalsawarded: number;
    goldmedalsawarded: number;
    profilepic : string;
    daysnotify: number;
    addresslocation: string;
    defaultlocationlat: number;
    defaultlocationlon: number;
    defaultnotificationradius: number;
    receivepushnotifications: boolean;
    receivesms: boolean;
    publicizeage: boolean;
    publicizename: boolean;
    publicizephone: boolean;
    publicizeemployments: boolean;
    publicizesalary: boolean;
    istrainer: boolean;
    iscoach: boolean;
    isreferee: boolean;
    bannedfromqmquntil : string | null;
    email_verified: boolean;
    phone_verified: boolean;
    receiveemailnotifications: boolean;
    subscribedtoemailnewsletters: boolean;
    publicizeun: boolean;
    lastchangedon: string;
    lasteditedby: number;
    timezone_minute_offset: number;
    isiosdevice: boolean;
    devicetoken: string;
    pwresettoken: string;
};

export type Friend = {
    id: number;
    uid1: number;
    uid2: number;
    dt_created: string;
}

export type PublicUser =  {
    id: number;
    includefriends: boolean;
    profilemeta: any;
    uid: number;
    endurance_avg: number;
    overallskill_avg: number;
    dexterify_avg: number;
    reaction_avg: number;
    tactical_avg: number;
    speed_avg: number;
    istrainer_avg: number;
    iscoach_avg: number;
    isreferee_avg: number;
    is_quickmatch_avg: number;
    isinstructor_avg: number;
    iseventrunner_avg: number;
    isplayer_avg: number;
    un: string;
    status: string;
    emailaddress: string;
    lookingfortrainer: boolean;
    lookingforcoach: boolean;
    lookingforteam: boolean;
    datejoined: string;
    firstname: string;
    middlename: string;
    lastname: string;
    lastchangedon: string;
    isfemale: boolean;
    lastloggedin: string;
    birthdate: string;
    bronzemedalsawarded: number;
    silvermedalsawarded: number;
    goldmedalsawarded: number;
    profilepic: string;
    moneyearned: number;
    bannedfromqmquntil : string;
    phonenumber: string;
    totalathletebadges: number;
    istrainer: boolean;
    iscoach: boolean;
    isreferee: boolean;

};

export interface Sport {
    id: number;
    name: string;
    description: string;
    addedbyuid: number;
    isapproved: boolean;
    moderatoruid: number;
    status : string;
    dt_created: string; //This is a date
    lastchangedon : string; //This is a date
    lasteditedby : number;
}

export interface SportRules {
    id: number;
    sportid: number;
    dt_created: string | Date;
    lastchangedon : string | Date;
    addedbyuid: number;
    lasteditedby: string;
    rulesname: string;
    requires_even_no_of_teams: boolean;
    additional_conducts: string;
    min_players_per_team: number;
    age_divider_type: number;
    max_players_per_team: number;
    status : string;
    min_teams: number;
    max_teams: number;
    multiple_teams_can_win: boolean;
    placements_max: number;
    team_win_ordering_strategy: string;
    requires_runner: boolean;
    max_coaches_per_team : number;
    max_trainers_per_team: number;
    max_instructors_per_team: number;
    max_refs: number;
    min_coaches_per_team: number;
    min_trainers_per_team: number;
    min_instructors_per_team: number;
    min_refs: number;
    prefer_fill_teams: boolean;
    duration_in_seconds: number;
    position_layout_map: Object | any;
}

export interface SportInterest {
    uid: number;
    id: number;
    sportid: number;
    selfproclaimedability: number;
}

export interface SportPosition {
    id: number;
    rulesid: number;
    name: string;
    x_coordinate: number;
    y_coordinate: number;
    sportid: number;
    min_per_event: number;
    max_per_event: number;
    dt_created: string;
    addedbyuid: number;
    lastchangedon: string;
}

export interface PlayableLocation {
    id: number;
    name: string;
    ispublic: boolean;
    hasindoors: boolean;
    hasoutdoors: boolean;
    addedbyuid: number;
    lastchangedon: string;
    lat: number;
    lng: number;
    avgrating: number;
    address: string;
    description: string;
    phonenumber: string;
    website: string;
    totalratings: number;
    voteups: number;
    votedowns: number;
    unusableuntil: string;
}

export interface Facility {
    id: number;
    placeid: number;
    addedbyuid: number;
    description: string;
    avgrating: number;
    totalratings: number;
    voteups: number;
    votedowns: number;
    unusableuntil: number;
    surface: string;
    a_type: string;
    totalsize: number;
    sport_layout_map: Object;
}

export interface Team {
    id : number;
    name: string;
    addedbyuid: number;
    dt_created: number;
    lookingfortrainer: boolean;
    lookingforcoach: boolean;
    picture: string;
    a_type : string;
    istemporary: boolean;
    lastchangedon: number;
    associated_eventid: number;
}
/**
 *     private Integer id;
 *     private Integer uid;
 *     private Integer teamid;
 *     @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", timezone="default")
 *     private Instant datejoined;
 *     @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX", timezone="default")
 *     private Instant dateleft;
 *     private String assignedrole;
 *     private Integer assignedby;
 */
export interface TeamMember {
    id : number;
    uid: number;
    teamid: number;
    datejoined : string;
    dateleft : string;
    assignedrole: string;
    assignedby : number;
}

export interface PufPubEventTeamMember {
    id : number;
    uid: number;
    un: string;
    firstname: string;
    profilepic: string;
    teamid: number;
    spid: number;
    position_name: string;
    x_coordinate: number;
    y_coordinate: number;
}

export type Gender = 'f' | 'm';
export interface TeamAndPubEventTeamMember {
    id: number;
    eventid: number;
    name: string;
    members: PufPubEventTeamMember[];
}


export type EventAndEventMemberIds  = PufEvent & {
    event_member_ids: Array<number>;
}

export interface SocialMessage {
  source_id: number;
  target_id: number;
  source_type: string;
  target_type: string;
  time_sent: string;
  message: string;
}

/**
 *
 *         pub uid: i32,
 *         pub sportname: String,
 *         pub rulesname: String,
 *         pub sportid: i32,
 *         pub totalplayed: i32,
 *         pub rulesid: i32,
 *         pub sport_percentage: f32,
 *         pub rules_percentage: f32,
 */
// Statistic view
export interface UserSportParticipationStats {
    uid: number;
    sportname: string;
    rulesname: string;
    sportid: number;
    totalplayed: number;
    rulesid: number;
    sport_percentage: number;
    rules_percentage: number;
}

export interface SuggestedEvent {
    id: number;
    runbyuid: number | null;
    age_group: number;
    coed_or_gender: Gender | 'c'; // c for coed.
    duration_in_seconds: number;
    estatus: string;
    pstatus: string;
    suggested_uid: number;
    sportname: string;
    rulesname: string;
    timestarts: null | string;
    timeends : null | string;
    timefinished: null | string;
    is_quickmatch: boolean;
    sportid: number;
    rulesid: number;
    lookingforreferee: boolean;
    dt_created : string;
    addedbyuid: number | null;
    pldescription: string;
    lat: number;
    lng: number;
    address: null | string;
    website: null| string;
    plunusableuntil : null| string;
    phonenumber: null | string;
    lastchangedon: string;
    ispublic: boolean;
    isindoors: boolean;
    plname: string;
    fdescription: string;
    surface: string;
    a_type : string;
    fnusableuntil: string | null;
    eventuidsandteamids: string;
}
/**
 *         pub id: i32,
 *         pub sportname: Option<String>,
 *         pub is_quickmatch: bool,
 *         pub rulesid: i32,
 *         pub dt_created: DateTimeUtc,
 *         pub placeid: i32,
 *         pub timestarts: Option<DateTimeUtc>,
 *         pub addedbyuid: i32,
 *         pub lastchangedon: DateTimeUtc,
 *         pub facilityid: Option<i32>,
 *         pub lookingforreferee: bool,
 *         pub entryprice: f32,
 *         pub runbyuid: Option<i32>,
 *         pub status_: String,
 *         pub sportid: Option<i32>,
 *         pub timeends: Option<DateTimeUtc>,
 *         pub timefinished: Option<DateTimeUtc>,
 *         pub age_group: i16,
 *         pub coed_or_gender: String,
 */
export interface PufEvent {
    id: number;
    sportname : null | string;
    is_quickmatch: boolean;
    rulesid: number;
    dt_created: number;
    placeid: number;
    timestarts: null | string;
    addedbyuid: number;
    lastchangedon: string;
    facilityid: null | number;
    status : string;
    sportid: number;
    timeends: null | string;
    timefinished: null | string;
    age_group: number;
    coed_or_gender: Gender |'c'; // c for coed.
}

export interface UserEvent {
    id: number;
    uid: number;
    age_group: number;
    un: string;
    coed_or_gender: Gender | 'c'; // c for coed.
    suggested_uid: number;
    sportname: string;
    rulesname: string;
    sportposition: string;
    equipment: string;
    defaultlocationlat: string;
    defaultlocationlon: string;
    estatus: string;
    pstatus : string;
    duration_in_seconds: number;
    timestarts: null | string;
    timeends : null | string;
    timefinished: null | string;
    timezone_minute_offset: number;
    is_quickmatch: boolean;
    sportid: number;
    rulesid: number;
    lookingforreferee: boolean;
    dt_created : string;
    runbyuid: number | null;
    addedbyuid: number | null;
    pldescription: string;
    lat: number;
    lng: number;
    address: null | string;
    website: null| string;
    plunusableuntil : null| string;
    phonenumber: null | string;
    lastchangedon: string;
    ispublic: boolean;
    isindoors: boolean;
    plname: string;
    fdescription: string;
    surface: string;
    a_type : string;
    fnusableuntil: string | null;
    eventuidsandteamids: string;
}

export interface UserBadge {
    uid: number | null;
    dategiven : string| null;
    count: null | number;
    badgename: string;
    ispositive: boolean;
    s_id: number;
    sr_id: number;
}

/**
 * pub uid: i32,
 *         pub unreviewedid: i32,
 *         pub type_: String,
 *         pub fkey: Option<i32>,
 *         pub details_1: Option<String>,
 *         pub details_2: Option<String>,
 *         pub details_3: Option<String>,
 */
export interface BillToReview {
    uid: number;
    unreviewedid: number;
    type : string;
    fkey: null | number;
    details_1 : null | string;
    details_2 : null | string;
    details_3: null | string;
}
/**
 *         pub uid: i32,
 *         pub endurance_avg: Option<f32>,
 *         pub overallskill_avg: Option<f32>,
 *         pub dexterity_avg: Option<f32>,
 *         pub reaction_avg: Option<f32>,
 *         pub tactical_avg: Option<f32>,
 *         pub speed_avg: Option<f32>,
 *         pub istrainer_avg: Option<f32>,
 *         pub isplayer_avg: Option<f32>,
 *         pub iscoach_avg: Option<f32>,
 *         pub isreferee_avg: Option<f32>,
 *         pub is_quickmatch_avg: Option<f32>,
 *         pub isinstructor_avg: Option<f32>,
 *         pub iseventrunner_avg: Option<f32>,
 */
export interface PlayerStats {
    uid: number;
    endurance_avg : null | number;
    overallskill_avg : null | number;
    dexterity_avg : null | number;
    reaction_avg : null | number;
    tactical_avg : null | number;
    speed_avg : null | number;
    istrainer_avg : null | number;
    isplayer_avg : null | number;
    iscoach_avg : null | number;
    isreferee_avg : null | number;
    is_quickmatch_avg : null | number;
    isinstructor_avg : null | number;
    iseventrunner_avg : null | number;
}

/**
 *     #[derive(Serialize, Deserialize, JsonSchema, PostgresMapper, Debug)]
 *     #[pg_mapper(table= "playable_locations_ml")]
 *     pub struct PlayabeLocationForML {
 *         pub id: i32,
 *         pub nationalPhoneNumber: Option<String>,
 *         pub internationalPhoneNumber: Option<String>,
 *         pub formattedAddress: String,
 *         pub websiteUri: Option<String>,
 *         pub displayName: String,
 *         pub editorialSummary: Option<String>,
 *         pub generativeSummary: Option<String>,
 *         pub reviewSummary: Option<String>,
 *         pub wheelchairAccessibleEntrance: i32,
 *         pub wheelchairAccessibleRestroom: i32,
 *         pub wheelchairAccessibleSeating: i32,
 *         pub wheelchairAccessibleParking: i32,
 *         pub lat: Option<f64>,
 *         pub lng: Option<f64>,
 *         pub city_and_state: String,
 *         pub satellite_img_filename: Option<String>,
 *         pub has_sports: bool
 *     }
 */
export interface PlayableLocationML {
	id: number;
	nationalPhoneNumber: null | string;
	internationalPhoneNumber:null | string;
	formattedAddress: null | string;
	websiteUri : null | string;
	displayName: null | string;
	editorialSummary : null | string;
	generativeSummary: null | string;
	reviewSummary: null | string;
	completed: boolean;
	playable_location_ref_id: null | number;
	wheelchairAccessibleEntrance: boolean;
	wheelchairAccessibleRestroom: boolean;
	wheelchairAccessibleSeating: boolean;
	wheelchairAccessibleParking: boolean;
	lat: null | number;
	lng: null | number;
	city_and_state: string;
	satellite_img_filename: null | string;
	dt_last_updated: null | string;
}

export interface CityTrack {
	id: number;
	rank: string;
	city_and_state: string;
	district: null | number;
	completed: boolean;
	lat: number;
	lng: number;
	dt_last_updated: null | string;
}

export interface FacilityMLReview {
	id: number;
	created_by_uid: number;
	facility_satellite_review_ref_id: number | null;
	created_by_un: string;
	reviewed_by_uid: null | number;
	reviewed_by_un: null | string;
	sportid: number;
	sportname: string;
	is_centered: boolean;
	is_cropped: boolean;
	is_accurate: boolean;
	playable_location_ml_ref: number;
	cropped_satellite_img_filename: string;
	dt_last_updated: null | string;
}