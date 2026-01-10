import {ProductAndPrices} from "./stripe";
import {
    Account,
    EventAndEventMemberIds,
    EventUserMember,
    Facility,
    PlayableLocation,
    PufEvent,
    Sport,
    SportPosition,
    SportRules,
    Team,
    TeamMember,
    User
} from "./schema";
import { Verification} from "./requests";


export type MetaList = {
    entries : MetaListEntry[];
    id : number;
    list_name: string;
}
export type MetaListEntry = {
    value: string | null;
    name: string;
}
export type LoginResponse = {
    user: User,
    account: Account,
    token: string
}

export type ServerResponse<T> = {
    isSuccessful: boolean;
    resp: T;
};
export type SessionResponse = {
    id: string;
    amountSubtotal: number;
    url: string;
    amountTotal: number;
    automaticTax: any;
    customerId: string;
    currency: string;
    locale: string;
    lineItems: any;
}

export type SubscriptionWrapper = {
    allMembershipSubscriptions : ProductAndPrices[];
    userSubscriptions: any[];
}

export type UserAndAccount = {
    user: User;
    account: Account;
    token: string;
}

export type MetaListResponse = {
    status: number;
    data: MetaList[];
}

export type NewUserResponse = {
    verify: {
        wasError: boolean;
        verifications: Verification[];
        descriptions: string;
        status: number;
    };
    entry: User;
};

export type JavaMessage<T = void> = T extends void
  ? JavaMessageWithoutData
  : JavaMessageWithData<T>;

export type JavaMessageWrapper<T = void> = {
	messages: JavaMessage<T>[];
};

export type JavaMessageWithoutData = {
    message: string;
    code: number;
    fields : string[];
}
export type JavaMessageWithData<T> = JavaMessageWithoutData & {
    data : T;
};



export abstract class ApiMessageResponseA {
    message: string;
    code: number;
    wasError: boolean;
}

export class ApiMessageResponse extends ApiMessageResponseA {
    public debugLog() : string {
        const msg = `ApiMessageResponse: <msg: ${this.message}, code: ${this.code}, wasError: ${this.wasError}>`;
        console.warn(msg);
        return msg;
    }
    public static fromServerResponse(resp: ServerResponse<any>) : ApiMessageResponse {
        const re = resp.resp as ApiMessageResponseA;
        const r = new ApiMessageResponse();
        r.message= re.message;
        r.code = re.code;
        r.wasError = re.wasError;
        r.debugLog();
        return r;
    }
}

export type NoResultsResponse = typeof ApiMessageResponse;

export type ServerStatistics = {
    [s in ServerStatusStatistic]: number;
};
export enum ServerStatusStatistic {
    totalPlayersRegisteredForAnEvent = 'totalPlayersRegisteredForAnEvent',
    totalEventsMovedToFinalizedFromPending = 'totalEventsMovedToFinalizedFromPending',
    totalEventsMovedToPendingFromFinalized = 'totalEventsMovedToPendingFromFinalized',
    totalEventsAbortedDueToNotEnoughPlayers = 'totalEventsAbortedDueToNotEnoughPlayers',
    totalEventsMovedToStarted = 'totalEventsMovedToStarted',
    totalEventsMovedToFinished = 'totalEventsMovedToFinished',
    totalEventAborts = 'totalEventAborts',
    totalAthletesWhoLeftAnEvent = 'totalAthletesWhoLeftAnEvent',
    totalAthletesWhoLeftAnEventAndAbortedAnEvent = 'totalAthletesWhoLeftAnEventAndAbortedAnEvent',
    totalAthletesWhoJoinedAnExistingEvent = 'totalAthletesWhoJoinedAnExistingEvent',
    totalAthletesWhoJoinedAnExistingEventManually = 'totalAthletesWhoJoinedAnExistingEventManually',
    totalAthletesWhoCouldNotJoinAnEventDueToLackOfFacilities = 'totalAthletesWhoCouldNotJoinAnEventDueToLackOfFacilities',
    totalAthletesWhoCouldNotJoinAnEventDueToBadRequest = 'totalAthletesWhoCouldNotJoinAnEventDueToBadRequest',
    totalAthletesWhoCouldNotJoinAnEventDueToMissingResource = 'totalAthletesWhoCouldNotJoinAnEventDueToMissingResource',
    totalAthletesWhoExperiencedAServerBug = 'totalAthletesWhoExperiencedAServerBug',
    totalTeamsCreated = 'totalTeamsCreated',
		totalUsersWhoCouldNotJoinAnEventDueToDrivingDistance = 'totalUsersWhoCouldNotJoinAnEventDueToDrivingDistance'
}

export enum ServerEvent {
    UserRegisteredAnEvent ="UserRegisteredAnEvent"  ,
    EventMovedToFinalizedFromPending = "EventMovedToFinalizedFromPending",
    EventMovedToPendingFromFinalized = "EventMovedToPendingFromFinalized",
    EventAbortedDueToNotEnoughUser = "EventAbortedDueToNotEnoughUser",
    EventMovedToStarted = "EventMovedToStarted",
    EventMovedToFinished ="EventMovedToFinished",
    EventAborts="EventAborts",
    UserWhoLeftAnEvent="UserWhoLeftAnEvent",
    UserWhoLeftAnEventAndAbortedAnEvent="UserWhoLeftAnEventAndAbortedAnEvent",
    UserWhoJoinedAnExistingEvent="UserWhoJoinedAnExistingEvent",
    UserWhoJoinedAnExistingEventManually="UserWhoJoinedAnExistingEventManually",
    UserWhoCouldNotJoinAnEventDueToLackOfFacilities="UserWhoCouldNotJoinAnEventDueToLackOfFacilities",
    UserWhoCouldNotJoinAnEventDueToBadRequest="UserWhoCouldNotJoinAnEventDueToBadRequest",
    UserWhoCouldNotJoinAnEventDueToMissingResource="UserWhoCouldNotJoinAnEventDueToMissingResource",
    UserWhoExperiencedAServerBug="UserWhoExperiencedAServerBug",
    TeamCreated="TeamCreated",
		UsersWhoCouldNotJoinAnEventDueToDrivingDistance = 'totalUsersWhoCouldNotJoinAnEventDueToDrivingDistance'
}

/**
 *     private static Long current_id = 0L;
 *     @Getter
 *     private Long id;
 *     @Getter
 *     private Date date;
 *     private ServerEvent serverEvent;
 *     @Getter
 *     private String longDescription;
 *     @Getter
 *     private String shortDescription;
 *     @Getter
 *     private Object metadata;
 */
export type QmQServerEvent = {
    date: number;
    shortDescription: string;
    longDescription: string;
    serverEvent: ServerEvent;
    metadata: { [key: string]: any };
};

export type OAuthResponsePart1 = {
    state: string;
    forward_url : string;
};

export type OAuthResponse = {
    code: string,
    state: string,
    scope: string,
};

export type PageInfo = {
    ordered_by: string[];
    offset : number;
    limit: number;
    asc: boolean;
}

export type Pageable<T> = {
    data: T[];
    page_info?: PageInfo;
}

export const getAllOAuthProviders = () : Provider[] => {
    return [ Provider.AMAZON, Provider.GOOGLE, Provider.APPLE, Provider.FACEBOOK];
}

export enum Provider {
    AMAZON="amazon",APPLE="apple",FACEBOOK="facebook",GOOGLE="google",
}


export type MapDetails = {
  [numberKey : string]: PlaceFacilitiesEvents;
};


export type PlaceFacilitiesEvents = {
    totalFacilities: number;
    minDurationInMillis: number;
    markerStatistics: AtlasSportStatistics | null;
    facilityEvents: Array<FacilityEvents>;
}

/**
 * @deprecated
 */
export type PlaceFacilities = {
    totalFacilities: number;
    facilityEvents: Array<FacilityWrapper>;
}

export type FacilityWrapper = {
    facility: Facility;
}

export enum MarkerRefreshInitType {
	FIRST_LOAD, PLS_AND_FACILITYEVENTS, FACILITYEVENTS, JUST_REACT_UPDATE
}

/**
 * Object is a hashmap of sportid and count for the sport.
 */
export type AtlasSportStatistics = {
	countOfPendingSports: Map<number, number> | null;
	countOfNewSports: Map<number, number> | null;
	countOfAbortedSports: Map<number, number> | null;
	countOfStartedSports: Map<number, number> | null;
	countOfEndedSports: Map<number, number> | null;
	countOfFinalizedSports: Map<number, number> | null;
};

export type FacilityEvents = {
    eventsUserJoined: null | Array<number>; // a list of eventsid
    facilitySportStatistics: AtlasSportStatistics | null; // specific to the
    // facility
    facility: Facility;
    events: null | Array<EventAndEventMemberIds>;
};
/**
 *     @JsonIgnore
 *     private List<Users> eventMemberUsers;
 *     @JsonIgnore
 *     private Users user;
 *     @JsonIgnore
 *     private List<SportPositions> allSportPositions = new ArrayList<>(); //default value in case event is new.
 *     @JsonIgnore
 *     private List<EventUserMembers> eventMembers = new ArrayList<>(); //default value in case event is new.
 *     @JsonIgnore
 *     private List<TestablePrimes> testableTeams;
 *     @JsonIgnore
 *     private List<LocationDistanceProxy> proxies;
 *     @JsonIgnore
 *     private GeneratedTD generatedData = new GeneratedTD();
 *     private EventUserMembers eventMember = new EventUserMembers();
 *     @JsonProperty("rules")
 *     private SportRules sportRules;
 *     @JsonProperty("sport")
 *     private Sports sports;
 *     private Teams team;
 *     @JsonIgnore
 *     private Accounts accounts;
 *     private List<TeamAndMembers> allTeams;
 *     private TeamMembers teamMember;
 *     @JsonProperty("sportPosition")
 *     private SportPositions sportPositions;
 *     private Events_ event;
 *     @JsonProperty("facility")
 *     private Facilities facilities;
 *     private PlayableLocations playableLocation;
 */
export type EntryResponse = {
    eventUserMembers: EventUserMember;
    rules: SportRules;
    sport: Sport;
    team: Team;
    allTeams: TeamAndMembers[];
    teamMember: TeamMember;
    sportPosition: SportPosition;
    event: PufEvent;
    facility : Facility;
    playableLocation : PlayableLocation;
}

export type TeamAndMembers = {
    members: TeamMember[];
    team: Team;
}

/**
 *     private Integer teamid;
 *     private HashMap<String, String> availablePositionsMap;
 */
export type TeamPositions = {
    teamid: number;
    availablePositionsMap : {[key : string] : string};
}
/**
 * Available positions for a what-if scenario.
 */
export type AvailablePositions = {
    teams: TeamPositions[];
}