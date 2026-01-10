import {Field, FieldWrapper, Form_, SeparatorField} from "../definitions/ui";

export type RecurseNodeOptions = {
    skip_append?: boolean;
    is_shallow? : boolean;
}

/**
 * If the function passed in, returns a value that the object must be of type
 * Field, void or any.  If it is not of
 * type Field, then it is appended to the form unless flag: skip_append =
 * true.  If it is of type any, and this flag is false, it will
 * destroy the Form
 * object. If the funciton returns void, then nothing is added or appended
 * to the Form object, automatically.  Some flags are possible:
 * skip_append = true: will simply run the function in place and skip
 * appending the return object to the Form object.
 * Returns a new copy of the Form object.
 * @param form
 * @param f
 */
export function recurseFormFieldNodes(form: Form_, f: (t: Field) => FieldWrapper | void | any, opts? : RecurseNodeOptions): Form_ {
    const { skip_append=false, is_shallow=false  } = opts ? opts : {};
 //   console.debug('options looks like', opts);
    let new_form = {...form};
  //  console.debug('new_form looks like', new_form);
    if (new_form.fields) {
        let index = 0;
        let fields = new_form.fields;
        if (!skip_append) {
            fields = new_form.fields ? new_form.fields.slice() : [];
        }
        while (index < fields.length) {
            const this_field = fields[index];
            if (skip_append) {
                f(this_field);
            } else {
                let { field, isdirty }  = f(this_field);
               // console.debug(`Values for: {field:
                // ${JSON.stringify(field)} ,  isdirty: ${isdirty}`);
                if (isdirty) {
                   // console.debug('[recurseFormFieldNodes] Field after
                    // modify' +
                    //    ' is', field);
                    if (field) {
                        fields[index] =  field;
                        //new_form.fields = new_fields;
                    } else  {
                        console.error('#1 res should not be null. should' +
                            ' not land' +
                            ' here');
                        throw new Error();
                    }
                }
            }
            if (this_field.type === 'separator' && (this_field as SeparatorField).fields?.length && !is_shallow ) {
                if (!skip_append) {
                    //const field_copy = { ...this_field};
                    let returned_node : Form_ = recurseFormFieldNodes(this_field as unknown as Form_, f, opts);
                    if (!returned_node) {
                //        console.error('no returned node in
                        //        recurseFormFNodes');
                        throw new Error();
                    } else {
                  //      console.debug('Updated field looks like',
                        //      returned_node);
                        /*
                        const fields_copy = returned_node.fields.slice();
                        returned_node.fields = fields_copy;
                        */
                        if (!skip_append) {
                            fields[index] = returned_node as unknown as Field;
                        }
                        //new_form.fields = new_fields;
                    }
                } else {
                    recurseFormFieldNodes(this_field as unknown as Form_, f, opts);
                }
            }
            index++;
        }
        if (!skip_append) {
            new_form.fields = fields;
        }
    } else {
       //console.error('Not a valid form object.  Needs to have' +
       //     ' fields' +
       //     ' or is itself an array of fields with length of at least 1.');
       //console.trace('throwing error during recurseFormFieldNodes');
       throw new Error();
    }
    return new_form;
}
/**
 * Searches for a form item/field.
 * Uses:
 * Executes the f function on each form-item node until the f function returns true.  Once it returns true,
 * That form item is returned.
 * The function parameter must return a boolean
 * @param form
 * @param f
 */
export function reduceFormFieldNodes(form, f: (t: any) => boolean): any {
    if (form.default) {
        form = form.default;
    }
    if (form.fields) {
        for (let field of form.fields) {
            const x = f(field);
            if (x) {
                //console.debug('found item', x);
                return field;
            }
            if (field.fields) {
                return reduceFormFieldNodes(field.fields, f);
            }
        }
    } else if (form.length) {
        for (let field of form) {
            const x = f(field);
            if (x) {
                //console.debug('found item', x);
                return field;
            }
            if (field.fields) {
                return reduceFormFieldNodes(field.fields, f);
            }
        }
    }
    return null;
}
