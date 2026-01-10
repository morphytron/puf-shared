// localization.test.ts
import { describe, expect, it } from 'vitest';
import Localization, { Local } from '../src/localization';
import BRONZE_ENG from "../json/jsontxts/bronze_tier.json";
import SILVER_ENG from '../json/jsontxts/silver_tier.json';
import GOLD_ENG from '../json/jsontxts/gold_tier.json';
const features_ = [
  {
    "name": "Features",
    "features": [
      {
        "name": "Gain points for winning and participation",
        "tiers": {
          "Gold": "3x",
          "Bronze": true,
          "Silver": "2x"
        }
      },
      {
        "name": "Convert points into purchases or quick-match prioritization.",
        "tiers": {
          "Gold": true,
          "Bronze": true,
          "Silver": true
        }
      },
      {
        "name": "May invite friends to their events.",
        "tiers": {
          "Gold": true,
          "Bronze": false,
          "Silver": true
        }
      },
      {
        "name": "Providing a way for bronzies to participate with you.",
        "tiers": {
          "Gold": true,
          "Bronze": false,
          "Silver": true
        }
      },
      {
        "name": "Manual event entry and scheduling future events.",
        "tiers": {
          "Gold": true,
          "Bronze": false,
          "Silver": true
        }
      },
      {
        "name": "You may take priority over bronzies when selecting a position.",
        "tiers": {
          "Gold": true,
          "Bronze": false,
          "Silver": true
        }
      },
      {
        "name": "You may take priority over silvers when selecting a position.",
        "tiers": {
          "Gold": true,
          "Bronze": false,
          "Silver": false
        }
      },
      {
        "name": "View all the reviews people have created of you.",
        "tiers": {
          "Gold": true,
          "Bronze": false,
          "Silver": true
        }
      },
      {
        "name": "View your own player statistics.",
        "tiers": {
          "Gold": true,
          "Bronze": false,
          "Silver": true
        }
      },
      {
        "name": "Chat with other members you have participated with using our dedicated chatting service.",
        "tiers": {
          "Gold": true,
          "Bronze": true,
          "Silver": true
        }
      }
    ]
  },
  {
    "name": "Analytics",
    "features": [
      {
        "name": "View your own player statistics.",
        "tiers": {
          "Gold": true,
          "Bronze": false,
          "Silver": true
        }
      },
      {
        "name": "View all the reviews people have created of you.",
        "tiers": {
          "Gold": true,
          "Bronze": false,
          "Silver": true
        }
      }
    ]
  },
  {
    "name": "Support",
    "features": [
      {
        "name": "24/7 online support",
        "tiers": {
          "Gold": true,
          "Bronze": false,
          "Silver": false
        }
      }
    ]
  }
];

describe('Localization Class', () => {
	it('should initialize with the correct locale', () => {
		const localization = new Localization(Local.ENG);
		expect(localization.local).toBe(Local.ENG);
	});

	it('should return correct subscription JSON texts for ENG locale', () => {
		const localization = new Localization(Local.ENG);
		const result = localization.get_subscript_jsn_txts();
		expect(result).toEqual([BRONZE_ENG, SILVER_ENG, GOLD_ENG]);
	});

	it('should return correct features for ENG locale', () => {
		const localization = new Localization(Local.ENG);
		const result = localization.get_features();
		expect(result).toEqual(features_);
	});


	it('should return an array not an object', () => {
		const localization = new Localization(Local.ENG);
		const result = localization.get_features();
		expect(result instanceof Array).toBe(true);
	});
});