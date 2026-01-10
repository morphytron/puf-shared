import * as loginColMapping from '../json/loginUserColMapping.json';
import *  as facilColMapping from '../json/facilityColMapping.json';
import * as playableLocation from '../json/plColMapping.json';
import * as playerStatsColMapping from '../json/playerStatsColMapping.json';
import * as sportparticipationstats from '../json/sportPartStatsColMapping.json';
import * as pufEvent from '../json/pufEventColMapping.json';
import * as sportRulesMapping from '../json/sportRulesColMapping.json';
import * as sportPosition from '../json/pufSportPosMapping.json';
import * as pubTeamMember from '../json/pubTeamMemberColMapping.json';
import * as sport from '../json/sportColMapping.json';
import * as pubUser from '../json/pubUserColMapping.json';
import {
	Facility,
	PlayableLocation, PlayerStats, PublicUser, PufEvent,
	Sport,
	SportPosition, SportRules, TeamMember,
	User, UserSportParticipationStats
} from "../definitions/schema";

export type ColMappingEntity<T> = { yesText: string, noText: string, label: string,type : string } & T;

export type ColumnMapping<T> = {[key : string] :  ColMappingEntity<T> | string };

export const colMapping : {[key : string] : ColumnMapping<any> } = {
	"loginUser" : loginColMapping as unknown as ColumnMapping<User>,
	"sportRules": sportRulesMapping as unknown as ColumnMapping<SportRules>,
	"sportPosition": sportPosition as unknown as ColumnMapping<SportPosition>,
	"sport": sport as unknown as ColumnMapping<Sport>,
	"pubTeamMember": pubTeamMember as unknown as ColumnMapping<TeamMember>,
	"facility" : facilColMapping as unknown as ColumnMapping<Facility>,
	"pubUser": pubUser as unknown as ColumnMapping<PublicUser>,
	"playableLocation": playableLocation as unknown as ColumnMapping<PlayableLocation>,
	"sportparticipationstats": sportparticipationstats as ColumnMapping<UserSportParticipationStats>,
	"playerStats" : playerStatsColMapping as unknown as ColumnMapping<PlayerStats>,
	"pufEvent": pufEvent as unknown as ColumnMapping<PufEvent>
};

export type DetailedColMapping = typeof colMapping;