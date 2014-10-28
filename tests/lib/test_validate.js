var assert = require('chai').assert;

var v = require('./../../lib/validate').Validate;
var Extract = require('./../../lib/validate').Extract;

describe('OSC Validate:', function () {
    describe('Address Symbol', function () {
        var  topic = null;

        it('invalid whitespace', function () {
            assert.equal(false, v.addr_s('address with spaces'));
        });

        it('invalid *', function () {
            assert.equal(false, v.addr_s('addresswith*'));
        });

        it('should not contain #', function () {
            assert.equal(false, v.addr_s('addresswith#'));
        });

        it('should not contain ,', function () {
            assert.equal(false, v.addr_s('addresswith,'));
        });

        it('should not contain /', function () {
            assert.equal(false, v.addr_s('addresswith/'));
        });

        it('should not contain ?', function () {
            assert.equal(false, v.addr_s('addresswith?'));
        });

        it('should not contain [', function () {
            assert.equal(false, v.addr_s('addresswith['));
        });

        it('should not contain ]', function () {
            assert.equal(false, v.addr_s('addresswith]'));
        });

        it('should not contain {', function () {
            assert.equal(false, v.addr_s('addresswith{'));
        });

        it('should not contain }', function () {
            assert.equal(false, v.addr_s('addresswith}'));
        });
    });

    describe('OSC tag', function () {
        var topic = null;

        it('should start with ,', function () {
            assert.equal(true, v.tag(',iii'));
        });

        it('should contain only legal chars', function () {
            assert.equal(false, v.tag(',abc'));
        });
    });

    describe('Extract', function () {
        var topic = null;

        it('extracts address path', function () {
            assert.deepEqual(['an', 'osc', 'address'], Extract.addr('/an/osc/address'));
        });

        it('matches {words}', function () {
            assert.deepEqual(Extract.brackets('{a,word,here}'), ['a', 'word', 'here']);
        });

        it('should not match {words', function () {
            assert.deepEqual(Extract.brackets('{a,word,here'), []);
        });
    });
});
