import { Sport, SportRules } from '../definitions/schema';

export const createSportRulesMapFromSportRulesResponse = (sportRules: SportRules[], the_sports : Sport[]) => {
    const the_map = {};
    the_sports.forEach(s => {
        let sport_rules_list = [];
        for (let sr of sportRules) {
            if (sr.sportid === s.id) {
                sport_rules_list.push(sr);
            }
        }
        console.debug('Setting sport_sport_rules map', s.id, sport_rules_list);
        the_map[s.id] = sport_rules_list;
    });
    console.log('Final sport/sport rules', the_map);
    return the_map;
}