import { SubRule } from '../definitions/ui';
import { HashUtil } from './hash_util';
import { getBindingIdentifiers } from '@babel/types';
import keys = getBindingIdentifiers.keys;
import { Facility, SportPosition, SportRules } from '../definitions/schema';

export interface Labelable {
    get title() : string;
    get key() : number;
}

/**
 *     private Integer min = -1;
 *     private Integer max = -1;
 *     private Integer threshold = -1;
 *     private HashMap<Integer, Integer> overlapIdsCount = new HashMap(4);
 */
export class PrimeConstraint {
    min : number = -1;
    max : number = -1;
    threshold : number = -1;
    overlapIdsCount : Map<number, number> = new Map();
}

export class RuleSetUtil {
    public static getNumberToNumberMapFromResponse(respObj : {[keys : string] : number}) : Map<number, number> {
        const val = new Map();
        Object.entries(respObj).forEach((o) => {
            const key = Number(o[0]);
            const v = o[1];
            val.set(key,  v);
        });
        return val;
    }
    public static getRuleSet_SportPositions(s : SportRules) : Map<number, number> {

        return RuleSetUtil.getNumberToNumberMapFromResponse(s.position_layout_map);
    }
    public static getRuleSet_FacilitySports(f : Facility) : Map<number, number> {
        return RuleSetUtil.getNumberToNumberMapFromResponse(f.sport_layout_map);
    }
}
/**
 * Requires that title and key are overridden.
 */
export abstract class Collectable<T> extends HashUtil implements Labelable {
    private ref_ : T;
    public get ref() : T {
        return this.ref_;
    };
    get title() : string {
        throw new Error("Title is not implemented");
    }
    get key() : number {
        throw new Error("Key is not implemented.");
    }
    constructor(ref_ : T) {
      super();
      this.ref_ = ref_;
      this.objKeyForA = this.title;
      this.objKeyForB = '' + this.key;
    }

    public fromObject(obj: {ref: T, title: string, key: number}): Collectable<T> {
        return new AnonymousCollectable(obj.ref, obj.title, obj.key );
    }

    public toObject() : {ref: T, title: string, key: number} {
        return {
          ref : this.ref_,
          title: this.title,
          key: this.key,
        };
    }
}


class AnonymousCollectable<T> extends Collectable<T> {
    private the_title = null;
    private the_key = -1;
    get title(): string {
        return this.the_title;
    }
    get key() : number {
        return this.the_key;
    }

    constructor(ref_ :T, title: string,  key: number) {
        super(ref_);
        this.the_key = key;
        this.the_title = title;
    }
}
/**
 * Requires that title and key are overridden.
 */
export abstract class CollectablePM<T> extends Collectable<T>  {
    constructor(ref : T) {
        super(ref);
        this.objKeyForA = this.title;
        this.objKeyForB = '' + this.key;
    }

    toSubRule(val : number) : SubRule {
        return {
            entityId: this.key,
            title: this.title,
            ruleValue: val
        };
    }
}
