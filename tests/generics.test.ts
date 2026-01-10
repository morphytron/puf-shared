import {describe, expect, it, vi} from 'vitest'
import * as gen from '../definitions/generic';


const addresses = [
    `805 West Country Club Dr\nTampa, FL 33612\nUnited State of America`,
    '805 West Country Club Drive\nTampa, FL 33612\nUS'
];

describe('addressClass works', () => {
   it('should convert an address string to an address field', () => {
       addresses.forEach(add => {
           let address = gen.Address.fromReadableString(add);
           expect(address).toBeDefined()
           expect(address.city.length).toBeGreaterThan(1);
           expect(address.country.length).toBeGreaterThan(1);
           expect(address.streetAddress.length).toBeGreaterThan(1);
       });
   }) ;
});