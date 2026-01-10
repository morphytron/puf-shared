import {SubRule} from "../definitions/ui";

export interface Ruleable {
    toSubRule(val : number): SubRule;
}