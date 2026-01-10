import { SubRule } from '../definitions/ui';
import { HashUtil } from './hash_util';

export interface Labelable {
    get title() : string;
    get key() : number;
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
    public toObject() : {ref: T, title: string, key: number} {
        return {
          ref : this.ref_,
          title: this.title,
          key: this.key,
        };
    }
}

/**
 * Requires that title and key are overridden.
 */
export abstract class CollectablePM<T> extends Collectable<T> {
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
