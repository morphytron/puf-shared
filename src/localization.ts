// front page features
import BRONZE_ENG from '../json/jsontxts/bronze_tier.json';
import SILVER_ENG from '../json/jsontxts/silver_tier.json';
import GOLD_ENG from '../json/jsontxts/gold_tier.json';
import features_ENG from '../json/jsontxts/features_eng.json';
// menu
import MENU_LABELS_ENG from '../json/jsontxts/menu_labels.json';
import MENU_DESCRIPTIONS_ENG from '../json/jsontxts/menu_descriptions.json';

const allLangsDictionary = {
	MENU_LABELS_ENG, MENU_DESCRIPTIONS_ENG,
	BRONZE_ENG, SILVER_ENG, GOLD_ENG, features_ENG,
};

export enum Local {
	ENG = 'ENG',
	SPN = 'SPN',
	MAND = 'MAND',
	PORT = 'PORT',
	FREN = 'FREN',
	GRMN = 'GRMN',
	RUSS = 'RUSS',
	SANSK = 'SANSK',
};
export type SubFeature = {
	name: string,
	tiers: { Gold: any, Silver: any, Bronze: any }
};
export type Feature = { name: string, features: SubFeature[] };

export default class Localization {
	local: Local = Local.ENG;

	constructor(a_locale: Local) {
		this.local = a_locale;
	}

	public get_subscript_jsn_txts(): string[][] {
		switch (this.local) {
			case Local.ENG: {
				return [BRONZE_ENG, SILVER_ENG, GOLD_ENG];
			}
		}
	}

	public get_features():
		Feature[] {
		switch (this.local) {
			case Local.ENG: {
				return features_ENG;
			}
		}
	}

	public get_menu_labels() : typeof MENU_LABELS_ENG {
		switch (this.local) {
			case Local.ENG: return MENU_LABELS_ENG;
		}
	}

	public get_menu_descriptions() : typeof MENU_DESCRIPTIONS_ENG {
		switch (this.local) {
			case Local.ENG: return MENU_DESCRIPTIONS_ENG;
		}
	}
}