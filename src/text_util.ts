export enum MaskType {
	email = '^[a-zA-Z0-9_\\-.]+@[a-zA-Z0-9_\\-.]+\\.[a-zA-Z0-9]+$',
	phone = '^([0-9]{3,3}-[0-9]{3,3}-[0-9]{4,4})|([0-9]{10,10})$',
	words = '^[a-zA-Z\.\t\n ]*$',
	wordsAndNumbers = '^[a-zA-Z0-9#\.\t\n ]*$',
	numeric = '^([0-9]+)|([0-9]+\.[0-9]+)$' // real
}

export class TextUtil {
	public static getRegexp(maskType: MaskType): RegExp {
		// Create RegExp on-demand to avoid static initialization issues
		return new RegExp(maskType);
	}
}