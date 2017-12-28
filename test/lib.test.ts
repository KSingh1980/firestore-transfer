import {expect} from 'chai';
import 'mocha';
import {isArray, isObject} from '../src/lib'

describe('Testing lib', () => {

    it('isArray of list should be true', () => {
        expect(isArray([1, 2, 3])).to.equal(true);
        expect(isArray([false])).to.equal(true);
    });

    it('isArray of empty list should be true', () => {
        expect(isArray([])).to.equal(true);
    });

    it('isArray of scalars should be false', () => {
        expect(isArray(42)).to.equal(false);
        expect(isArray('text')).to.equal(false);
        expect(isArray(true)).to.equal(false);
    });

    it('isObject of obj should be true', () => {
        expect(isObject({a: 1, b: 2})).to.equal(true);
        expect(isObject({a: [1, 2, 3], b: {x: 1}})).to.equal(true);
    });

    it('isObject of empty obj should be true', () => {
        expect(isObject({})).to.equal(true);
    });

    it('isObject of scalars should be false', () => {
        expect(isObject(42)).to.equal(false);
        expect(isObject('text')).to.equal(false);
        expect(isObject(false)).to.equal(false);
    });
    
    it('isObject of list should be false', () => {
        expect(isObject([1, 2, 3])).to.equal(false);
        expect(isObject([])).to.equal(false);
    });

});

