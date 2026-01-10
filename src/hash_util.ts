export interface Hashable {
	set objKeyForA(obja: string);

	set objKeyForB(objb: string);

	createHash(a: number, b: number): void;

	extractKeysAsInt(): [number, number];

	extractKeysAsStr(): [string, string];

	extractKeys(): [any, any];
}

export abstract class HashUtil implements Hashable {
	objKeyB: string = '';
	objKeyA: string = '';
	hash = '';
	isNumeric: boolean = false;

	constructor() {
	}

	public set objKeyForA(obja: string) {
		this.objKeyA = obja;
	}

	public set objKeyForB(objb: string) {
		this.objKeyB = objb;
	}

	public createHash(): void {
		this.hash = '' + (this.objKeyA ? this[this.objKeyA] : '') + ':' + (this.objKeyB ? this[this.objKeyB] : '');
	}

	extractKeysAsInt(): [number, number] {
		return this.hash.split(':').map(a => parseInt(a)) as [number, number];
	}

	extractKeysAsStr(): [string, string] {
		return this.hash.split(':') as [string, string];
	}

	public extractKeys(): [number, number] | [string, string] {
		return this.isNumeric ? this.extractKeysAsInt() : this.extractKeysAsStr();
	}

	public toString() {
		return this.hash;
	}
}

export class HashableClasses<A extends Object, B extends Object> extends HashUtil {
    private obj: A;
    private obj_2 : B;
    createHash(): void {
		this.hash = '' + (this.objKeyA ? this.obj[this.objKeyA] : '') + ':' + (this.objKeyB ? this.obj_2[this.objKeyB] : '');
	}
	constructor(object: A, object_b: B, key1: string, key2: string) {
		super();
        this.obj = object;
        this.obj_2 = object_b;
		this.objKeyForA = key1;
		this.objKeyForB = key2;
		this.createHash();
	}
}