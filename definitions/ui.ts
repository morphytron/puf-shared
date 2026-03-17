// player user stats
import {
	PlayerStats, Team,
	TeamAndPubEventTeamMember,
	UserSportParticipationStats,
} from './schema';
import { HttpCall } from '../src/network';
import {Collectable, CollectablePM} from '../src/collectable_utils';

export const emptyUserPlayerStats = {
	playerStats: {} as PlayerStats,
	userStats: [] as UserSportParticipationStats[],
};
export type PublicUserPlayerStats = typeof emptyUserPlayerStats;

export type FieldWrapper = {
	field: Field,
	isdirty: boolean
}

//Form
export type Form_ = {
	backgroundImgUri?: string;
	https_call: typeof HttpCall;
	persist_key: string;
	merging_data_patch?: { [key: string]: string | { type: string } };
	merging_data?: { [key: string]: string | { type: string } };
	fields: Field[];
};
export type PropsDataAccessMeta = {
	type: 'array' | 'map' | 'selectarray',
	accessPath: string[]
};
export type Field =
	DateField
	| TextField
	| SeparatorField
	| SliderField
	| SectionedListField
	| MenuItemField
	| PositionSelectField
	|
	TeamAndPositionSelectField
	| ButtonArrayField
	| PrimeLayoutField
	| GeocodeField
	| SwitchField;

export type PositionSelectField = FormField & {
	type: 'position_select';
	isAdd: boolean;
	isTeamView: boolean;
	isSelectable: boolean;
	multiSelect: boolean;
};
export type TeamAndPositionSelectField = FormField & {
	type: 'teamandpositionselect',
	teamColumn: string;
	positionsColumn: string;
};
export type ButtonArrayField = FormField & {
	type: 'buttonarray';
	children: {
		'type': 'button';
		'label': string;
		'isedit': boolean;
		'color': string;
		'id': string;
		'accessibilityLabel': string;
		'purpose': 'reset' | 'submit' | 'clear' | string;
	}[];
};
export type PrimeLayoutField = FormField & {
	type: 'prime_layout';
	useHstoreAsObjOfNumbers: boolean;
	disableMinimum: boolean;
	propsDataAccessor: PropsDataAccessMeta;
	objectLabel: string;
	subjectLabel: string;
	entityLabel: string;
	maxThresholdValue: number;
	entityIcon: string;
	addButtonText: string;
	ruleTemplate: any;
	jsonEntityNameSelector: string;
	rulecount: number;
	sumMaxofMinMax: number;
	description: string;
	maxSumOfOverlaps: number;
	height: number;
}
export type GeocodeField = FormField & {
	type: 'geocode';
	columnLat?: string;
	columnLng?: string;
	geoLocationOptions: any;
};
export type SwitchField = FormField & {
	type: 'switch';
	selected: boolean;
	mayHaveTypeInValue?: boolean;
	data: { type: string; } | {
		name: string;
		selected: boolean;
		value: string | number | boolean
	}[];
	noText: string;
	yesText: string;
	defaultName?: string;
	defaultValue?: string;
};
export type SliderField = FormField & {
	type: 'slider';
	convert: string;
	step: number;
	unit: string;
	min?: number;
	max?: number;
	relativeMinCol?: string;
	relativeMaxCol?: string;
	maximumTintColor?: string;
};
export type SeparatorField = FormField & {
	type: 'separator';
	defaultOpen?: boolean;
	notAnAccordian? : boolean;
	title: string | {
		create: string;
		edit: string;
	};
	fields?: Field[];
	issubform?: boolean;
	metacollapse?: { iscollapsed?: boolean, easing: string };
	dissolves?: boolean;
};
export type DateField = FormField & {
	type: 'date' | 'datetime' | 'time' | 'datetimerange';
	min: { type: string };
	max: { type: string };
	label: string;
};
export type MenuItemField = FormField & {
	type: 'menuitem';
	text: string;
	icon: string;
	navigateTo?: string;
	networkMethod?: string;
};
export type TextField = FormField & {
	validation?: {
		regexp: 'alphabet' | 'number' | 'alphanumeric' | 'phonenumber' | 'password',
		min?: number,
		max?: number
	};
	mustMatchColumn?: string;
	isinvalid?: boolean;
	secureTextEntry?: boolean;
	numberOfLines?: string;
	value?: any;
	multiline?: boolean;
	placeholderTextColor?: string;
	lowercase: boolean;
	placeholder: string;
	maximumTintColor?: string;
};
export type SectionedListField = FormField & {
	type: 'sectionedlist';
	isMultiSelect?: boolean;
	propsDataAccessor?: PropsDataAccessMeta;
	list_name?: string;
	data?: { type: any } | { name?: string; value?: string | number | boolean }[];
	multiColumn?: { type: 'values'  /*| "names"*/ };
	defaultEnabled?: boolean;
	mustBeDefined?: boolean;
	isSportPositions?: boolean;
	iconMeta? : {imageKey: string};
	usevalue?: boolean;
	defaultName?: string;
	usedata?: boolean;
};
export type FormField = {
	type: string | any;
	id: string;
	isinvalid?: boolean;
	title: { edit: string, create: string } | string;
	encryptInStorage?: boolean; // local storage
	column?: string;
	subheader?: string;
	enabledIf?: string;
	disabled?: boolean;
	defaultValue?: number | string;
	defaultValue2?: number | string;
	column2?: number | string;
	label?: { edit: string, create: string } | string;
	isedit?: boolean;
	selected?: boolean;
	doActionType?: string;
	isCreate?: boolean;
	ignoreRefactorizeForPostable?: boolean;
	clearOnBack?: boolean;
	mustBeDefined?: boolean;
	style?: string;
	value?: any;
	newonly?: boolean;
};

export enum ManagerMode {
	Add,
	EditDelete,
	None,
}

// Prime Mapper

export enum RuleType {
	min_max,
	threshold,
	not_selected,
}

export type Rule = {
	title: string;
	ruleType: RuleType;
	entityId: number;
	ruleOverlapValue: number;
	ruleMinValue: number;
	ruleMaxValue: number;
	subrules?: SubRule[];
};

export type RuleEntityWrapper = {
	rules: Rule[];
	entityArray: { key: number; value: number }[];
};

export type SubRule = {
	title: string;
	entityId: number;
	ruleValue: number;
};
export type TeamWithPubEventTeamMembers = TeamAndPubEventTeamMember & {
	team: Team;
}
export type OptionalEntryConfig = {
	default_disabled?: boolean;
	default_selected?: boolean;
	name_key?: string;
	value_key?: string;
	usevalue?: boolean;
	selected_default?: string | number | boolean;
	is_collectable?: boolean;
}

export class Entry<T> {
	name: string | number;
	value: string | any;
	id?: number | string;
	selected?: boolean;
	data?: T[];
	disabled?: boolean;

	/**
	 * Options are default_selected flag, default_disabled flat,
	 * Options:
	 * name_key=string,value_key:string,default_selected=boolean,default_disabled=boolean
	 * @param array_entity
	 * @param opts
	 */
	public static from<T>(array_entity: Array<T>, opts = {} as OptionalEntryConfig): Array<Entry<T>> {
		let {
			default_disabled = false,
			selected_default = null,
			default_selected = false,
			name_key = 'name',
			value_key = 'value',
			usevalue = false,
			is_collectable = false,
		} = opts;
		let new_arr: Entry<T>[] = array_entity.map((i, ind) => {
			if (is_collectable) {
				const name = usevalue ? (i as Collectable<any>).key : (i as Collectable<any>).title;
				const value = usevalue ? (i as Collectable<any>).title : (i as Collectable<any>).key;
				let selected = default_selected;
				if (usevalue) {
					selected = selected || value === selected_default;
				} else {
					selected = selected || name === selected_default;
				}
				return {
					id: (i as Collectable<any>).ref.id,
					disabled: default_disabled,
					selected: selected,
					data: [i],
					name: name,
					value: value,
				} as Entry<T>;
			} else {
				let selected = default_selected;
				const name = usevalue ? i[value_key] : i[name_key];
				const value = usevalue ? i[name_key] : i[value_key];
				if (usevalue) {
					selected = selected || value === selected_default;
				} else {
					selected = selected || name === selected_default;
				}
				return {
					id: (i as any).id,
					disabled: default_disabled,
					selected: selected,
					data: [i],
					name: name,
					value: value,
				} as Entry<T>;
			}
		});
		return new_arr;
	}

	/**
	 * To Serializeable
	 * @param entries
	 * @param toCollectable
	 */
	public static to<T, X extends Collectable<T>>(entries: Entry<T | X>[]): T[] | {title: string, key: number, ref: T}[] {
		if (entries.length && entries[0].data[0] instanceof Collectable) {
			return entries.flatMap(e => e.data.flatMap((e) => {
				return (e as X).toObject();
			}));
		}
		return entries.flatMap(t => t.data[0]) as T[];
	}
};


export type IncorrectRule = {
	title: any;
	ruleType: any;
	entityId: any;
	ruleValue: any;
};

export const emptyEventFilter = {
	typeSelectedFilter: [],
	surfaceSelectedFilter: [],
	statusSelectedFilter: [],
	sportSelectedFilter: [],
	filterIsDisabled: true,
};
export type EventFilter = typeof emptyEventFilter;
