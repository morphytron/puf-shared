import {HttpCall} from "../src/network";
import {Field} from "./ui";
import { MaskType, TextUtil } from '../src/text_util';

export type LatLng = {
    lat: number;
    lng: number;
}

/// HStore objects
export type ProfileMeta = {
    current_external_teams : string[] | string;
    past_external_teams: string[] | string;
    sport_positions_by_sport_id: Object;
};

/// Devices
/**
 *  pub deviceToken: Option<String>,
 *  pub isIos: Option<bool>,
 *  pub isDeregister: bool,
 *  pub updateLastLoggedOn: bool,
 */
export type MetaDevice = {
    deviceToken: string | null;
    isIos: boolean | null;
    isDeregister: boolean;
    updateLastLoggedOn: boolean;
}

/**
 * The key is the sportid.  It can be negative or not.  If it is negative,
 * the number follows specific derivable value from the formula:
 *
 * If the key is positive, it follows a different value from this
 * different formula:
 */
export type PrimeMapperMap = {[key: number] : number};


/**
 * For storing user address location / default location
 */
export class Address {
	city: string = '';
	state: string = '';
	zipcode: string = '';
	streetAddress: string = '';
	country: string = 'US';

	constructor(city: string, state: string, zipcode: string, streetAddress: string, country: string = 'US') {
		this.city = city;
		this.streetAddress = streetAddress;
		this.zipcode = zipcode;
		this.state = state;
		this.country = country;
	}

	public static fromReadableString(readable: string): Address {
		const addr = new Address('', '', '', '');
		readable.split('\n').forEach((line, index) => {
			switch (index) {
				case 0: {
					// street address
					addr.streetAddress = line;
					break;
				}
				case 1: {
					// city and state
                    let temp = line.split(",");
                    if (temp.length === 3) {
                        temp = temp.slice(1);
                    } else if (temp.length !== 2) {
                        console.error('Could not extract city, state, and' +
                            ' zipcode, there are ' + temp.length + ' lines');
                    }
					line.split(', ').forEach((phrase, lineI) => {
						console.debug('At city and state: ', phrase, lineI);
                        switch (lineI) {
							case 0: {
								addr.city = phrase;
								break;
							}
							case 1: {
								const stateZipcodeArr = phrase.split(" ");
								let count = 0;
								for (let s of stateZipcodeArr) {
                                    console.debug('stateZipcodeArr: ', s);
									if (count === 0) {
										addr.state = s;
									} else {
										addr.zipcode = s;
									}
									count++;
								}
								break;
							}
						}
					});
					break;
				}
				case 2: {
					// country
					addr.country = line;
					break;
				}
			}
		});
		addr.format();
        console.debug(JSON.stringify(addr));
		if (addr.isValid()) {
			return addr;
		} else {
			throw Error('address is invalid');
		}
	}

	public format(): void {
		this.city = this.city.trim();
		this.state = this.state.trim();
		this.zipcode = this.zipcode.trim();
		this.streetAddress = this.streetAddress.trim();
		this.country = this.country.trim();
        console.debug(`${this.streetAddress}\n${this.city}, ${this.state} ${this.zipcode}\n${this.country}`);
	}

	public toLinearString(): string {
		return `${this.streetAddress}. ${this.city}, ${this.state} ${this.zipcode}.  ${this.country}`;
	}

	public toReadableString(): string {
		return `${this.streetAddress}\n${this.city}, ${this.state} ${this.zipcode}\n${this.country}`;
	}

	public cityIsValid(): boolean {
		return TextUtil.getRegexp(MaskType.words).test(this.city);
	}

	public streetAddressIsValid(): boolean {
		return TextUtil.getRegexp(MaskType.wordsAndNumbers).test(this.streetAddress);
	}

	public stateIsValid(): boolean {
		return TextUtil.getRegexp(MaskType.words).test(this.state);
	}

	public countryIsValid(): boolean {
		return TextUtil.getRegexp(MaskType.words).test(this.country);
	}

	public zipcodeIsValid(): boolean {
		return TextUtil.getRegexp(MaskType.numeric).test(this.zipcode);
	}

	public isValid(): boolean {
        console.debug(this.cityIsValid(), this.streetAddressIsValid(), this.countryIsValid(), this.zipcodeIsValid(), this.stateIsValid());
		return this.cityIsValid() && this.streetAddressIsValid() && this.countryIsValid() &&
            this.zipcodeIsValid() && this.stateIsValid();
	}
}
