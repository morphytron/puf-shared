import { MetaList, MetaListResponse, Pageable } from '../definitions/responses';

export default class Timehelper {

	public static makeDate(api_utc_string: string) : Date {
		let d;
		try {
			d = new Date(api_utc_string.slice(0,10) + 'T' + api_utc_string.slice(11,19) + 'Z');
		} catch (e) {
			d = new Date(api_utc_string);
		}
		return d
	}

	public static prettifyDateToLocalHour(date: Date) : string {
		let currentHour = '' + date.getHours() % 12 + 1;
		currentHour += date.getHours() >= 11 ? ' PM' : ' AM';
		return currentHour;
	}

	public static getStringForWeekdayName(date: Date)  : string {
		if (new Date().getDay() === date.getDay()) {
			return 'today';
		} else {
			switch(date.getDay()) {
				case 0: {
					return 'Sunday';
				}
				case 1: {
					return 'Monday'
				}
				case 2: {
					return 'Tuesday'
				}
				case 3: {
					return 'Wednesday'
				}
				case 4: {
					return 'Thursday'
				}
				case 5: {
					return 'Friday'
				}
				case 6: {
					return 'Saturday'
				}
				default: {
					return 'Should not default...'
				}
			}
		}
	}

	/**
	 * For persisting data, not for display.
	 * @param d
	 */
	public static getDateTimeFromDate(d: Date): string {
		console.log(d);
		const hour = d.getUTCHours();
		const mins = d.getUTCMinutes();
		const secs = d.getUTCSeconds();
		const millis = d.getUTCMilliseconds();

		const d_string =
			Timehelper.addZeroTo1digit(d.getUTCFullYear()) +
			'-' +
			Timehelper.addZeroTo1digit((d.getUTCMonth() + 1)) +
			'-' +
			Timehelper.addZeroTo1digit(d.getUTCDate()) +
			' ' +
			Timehelper.addZeroTo1digit(hour) +
			':' +
			Timehelper.addZeroTo1digit(mins) +
			':' +
			Timehelper.addZeroTo1digit(secs) +
			'.' +
			('' + millis).slice(0, 6) + ' UTC';
		console.debug('d_string for now_datetime is ' + d_string);
		return d_string;
	}

	public static makeDateIntoDateStr(date? : Date) : string {
	  return date?.toISOString().slice(0, 10);
	}
	public static prettifyDateIntoDateStr(date? : Date): string {
		return date?.toLocaleDateString();
	}
	public static makeDateIntoDateTimeStr(date? : Date) : string {
		return this.getDateTimeFromDate(date);
	}

	public static prettifyDateIntoDateTimeStr(date? : Date): string {
		return date?.toLocaleDateString() + " " + date?.toLocaleTimeString();
	}
	public static prettifyDateIntoTimeStr(date? : Date): string {
		let final = "";
		const hours = date.getHours();
		const rem = hours % 12;
		final += hours === 0 || hours === 11 ? "12" : (rem === 0 ? "12" :  rem);
		final += ":" + Timehelper.addZeroTo1digit(date.getMinutes()) + " ";
		final += hours >= 11 ? 'PM' : 'AM';
		//alert(final);
		return final;
	}
	public static addZeroTo1digit(number: string | number) : string {
		if (typeof(number) === 'number') {
			number = number + '';
		}
		if (number.length === 1) {
			return '0' + number;
		} else {
			return number;
		}
	}

	public static getNowDateString() : string {
		const date = new Date(Date.now());
		const hours = date.getHours();
		return (
			(hours % 12 === 0 ? 12 : hours) +
			':' +
			date.getMinutes() +
			':' +
			date.getSeconds() +
			' ' +
			(hours >= 12 ? 'PM' : 'AM')
		);
	}

	public static getMinDate(kind: { type: string }, metaLists?: Pageable<MetaList>) {
		switch (kind.type) {
			case 'now': {
				return new Date();
			}
			case 'birthdate': {
				return new Date(1920, 0, 1);
			}
			case 'goodforuntil': {
				console.debug(metaLists);
				const data_ = metaLists.data;
				let min = 0;
				for (let x  of data_) {
					if (x.list_name === 'cnt_qm_good4_min_max') {
						console.debug('x.entries[0]', x.entries[0]);
						min = Number(x.entries[0].value);
						console.log('goodforuntil min value is', min);
						break;
					}
				}
				return new Date(Date.now() + 1000 * 60 * min); // The last 1.1
				// multiple is for ensuring it is slightly more than an hour from now
			}
			default: {
				console.error('SHOULD NOT DEFAULT ON GETMINDATE.');
			}
		}
	}
	public static getMaxDate(kind: { type: string }, metaListsResponse: Pageable<MetaList>) {
		switch (kind.type) {
			case 'birthdate': {
				return new Date(Date.now());
			}
			case 'eveCreate': {
				return new Date(Date.now() + 1000 * 60 * 60 * 24 * 7 * 8) //can plan two months in advance only.
			}
			case 'goodforuntil': {
				const data_ = metaListsResponse.data;
				let max = 0;
				for (let x  of data_) {
					if (x.list_name === 'cnt_qm_good4_min_max') {
						console.debug('x.entries[1]', x.entries[1]);
						max = Number(x.entries[1].value);
						console.log('goodforuntil max value is', max);
						break;
					}
				}
				return new Date(Date.now() + 1000 * 60 * max);
			}
			default: {
				console.error('SHOULD NOT DEFAULT ON GETMAXDATE.');
			}
		}
	}
}
