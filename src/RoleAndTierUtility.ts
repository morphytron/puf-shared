export enum AthleteSubscription {
	AthleteTier0, AthleteTier1, AthleteTier2,
}
export enum Role {
	admin='admin', moderator='moderator', user='user', new='new'
}
export class RoleAndTierUtility {
	public static hasAccessToPersonalStats(tier: number, role: string) : boolean {
		if (tier === AthleteSubscription.AthleteTier1 || tier === AthleteSubscription.AthleteTier2 || tier || role === Role.admin || role === Role.moderator) {
			return true;
		}
		return false;
	}
	public static checkGenericRoles(role: Role, acceptableRoles: Role[]) : boolean {
		for (let acceptablerole of acceptableRoles) {
			if (role === acceptablerole) {
				return true;
			}
		}
		return false;
	}
}
