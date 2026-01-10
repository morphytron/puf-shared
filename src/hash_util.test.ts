import { expect, test, assert } from 'vitest'
import {HashableClasses} from './hash_util';
test('Make sure HashableClasses does not return different results in a map' +
    ' when hashableclasses have been created twice for the same hashable' +
    ' key.', () => {

    const amap = new Map<string, string>();
		let hashableOne = new HashableClasses({"key": "1"}, {"another": "2"}, "key", "another");
		let hashableTwo = new HashableClasses({"key": "1"}, {"another": "2"}, "key", "another");
    amap.set(hashableOne.toString(), "an answer");
    amap.set(hashableTwo.toString(), "second answer");
    assert.equal(amap.get(new HashableClasses({"key": "1"}, {"another": "2"}, "key", "another").toString()),"second answer");
});