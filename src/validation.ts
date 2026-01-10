export type FieldValidation = {
    regexp: string;
    min: number | null;
    max: number | null;
};

export const regexp_map = {
    phonenumber: /^[0-9]{3,3}-[0-9]{3,3}-[0-9]{4,4}$/,
    alphabet: /^[a-zA-Z]*$/,
    alphanumeric: /[a-zA-Z0-9]*/,
    password: /^[a-zA-Z0-9\$#@%\^&\*!]*$/,
    email: /^[a-zA-Z0-9\._\-]+@[a-z_\-\.A-Z0-9]+\.[a-zA-Z0-9_\-\.]+$/
}

export default class ValidationUtility {
    /**
     * returns null if it validates.
     */
    public static validate(input? : string, validation?: FieldValidation, column?: string) : string | null  {
        if (input) {
            if (validation) {
                if (validation.min) {
                    if (input.length < validation.min) {
                        return validation.min + ' minimum characters required.';
                    }
                }
                if (validation.max) {
                    if (input.length > validation.max) {
                        return `Cannot exceed ${validation.max} characters.`;
                    }
                }
                let regular_expression = regexp_map[validation.regexp];
                console.debug('REGEXP is ' + regular_expression);
                if (regular_expression.test(input)) {
                    console.debug('PASSES REGEXP TEST');
                    return null
                } else {
                    console.trace('FAILS REGEXP TEST: <reg,input>', regular_expression, input);
                    return `${column ? column + ' n' : 'N'}eeds to be a(n) ${validation.regexp}`;
                }
            }
        } else {
            console.trace('NO INPUT PASSED INTO validate FUNCTION', input);
            return `${column ? column + ' n' : 'N'}eeds to be a(n) ${validation.regexp}`;
        }
        return null;
    }

    public static workable(input : string, validation?: FieldValidation, column?: string) : string | null  {
        if (validation) {
            let reg = regexp_map[validation.regexp];
            if (reg.test(input)) {
                return null
            } else {
                return `${column ? column + ' n' : 'N'}eeds to be a ${validation.regexp}`;
            }
        }
        return null;
    }

    public static validateAppend(input: string, validation: FieldValidation, column? : string, msgs?: string[]) : string[] {
        let msgs_ = msgs;
        if (!msgs_) {
            msgs_ = [];
        }
        let msg = ValidationUtility.validate(input, validation, column);
        if (msg) {
            msgs_.push(msg);
        }
        return msgs_;
    }
}