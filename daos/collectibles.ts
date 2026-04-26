import { Collectable, CollectablePM } from '../src/collectable_utils';
import {
    PufEvent,
    PufPubEventTeamMember,
    Sport,
    SportPosition,
    SportRules, TeamAndPubEventTeamMember, TeamMember,
} from '../definitions/schema';
import { MetaListEntry, TeamAndMembers } from '../definitions/responses';

export class PrimeMapperSportPosition extends CollectablePM<SportPosition> {
    get key(): number {
        return this.ref.id;
    }
    get title(): string {
        return this.ref.name;
    }
    constructor(sport_position: SportPosition) {
        super(sport_position);
    }
}

export type PMTeamAndPubEventTeamMember = {
    members: PrimeMapperPublicEventTeamMember[],
    id: number;
    eventid: number;
    name: string;
}


export class PrimeMapperTeamMember extends CollectablePM<TeamMember> {
    get key(): number {
        return this.ref.id;
    }
    get title(): string {
        return this.ref.assignedrole;
    }
    constructor(teamMap : TeamMember)  {
        super(teamMap);
    }
}

export class PrimeMapperTeamAndMembers extends CollectablePM<TeamAndMembers>  {
    get key() : number {
        return this.ref.team.id;
    }
    get title(): string {
        return this.ref.team.name;
    }

    constructor(teamAndTeamMembers: TeamAndMembers) {
        super(teamAndTeamMembers);
    }
}


export class PrimeMapperPublicTeamAndEventTeamMember extends CollectablePM<PMTeamAndPubEventTeamMember> {
    get key() : number {
        return this.ref.id;
    }
    get title(): string {
        return this.ref.name;
    }

    constructor(teamAndPubEventTeamMember: PMTeamAndPubEventTeamMember) {
        super(teamAndPubEventTeamMember);
    }
}

export class PrimeMapperPublicEventTeamMember extends CollectablePM<PufPubEventTeamMember> {
    get key() : number {
        return this.ref.id;
    }
    get title(): string {
        return this.ref.firstname + "/" + this.ref.position_name;
    }
    constructor(pufpubteammember: PufPubEventTeamMember) {
        super(pufpubteammember);
    }
}

export class PrimeMapperSportRules extends CollectablePM<SportRules> {
    get key(): number {
        return this.ref.id;
    }
    get title(): string {
        return this.ref.rulesname;
    }
    constructor(sr: SportRules) {
        super(sr);
    }
}

/**
 * The prime mapper aspect of this object is the underlying sport entity that
 * it has
 * a reference to.
 */
export class PrimeMapperEvent extends CollectablePM<PufEvent> {
    get title(): string {
        return this.ref.sportname;
    }
    get key(): number {
        return this.ref.sportid;
    }
    constructor(eve: PufEvent) {
        super(eve);
    }
}

export class PrimeMapperSport extends CollectablePM<Sport> {
    get title(): string {
        return this.ref.name;
    }
    get key(): number {
        return this.ref.id;
    }
    constructor(sport: Sport) {
        super(sport);
    }
}

export class PrimeMapperMetalist extends Collectable<MetaListEntry> {
    id : number;
    get title(): string {
        return this.ref.name;
    }
    get key(): number {
        return this.id;
    }
    constructor(ml: MetaListEntry, entry_id: number) {
        super(ml);
        this.id = entry_id;
    }
}
