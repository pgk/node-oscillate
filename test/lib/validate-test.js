var vows = require('vows'),
    assert = require('assert');

var	v = require('./../../lib/validate').Validate;
var Extract = require('./../../lib/validate').Extract;

vows.describe('OSC Validate:').addBatch({
	'Address Symbol': {
		topic: null,
		'invalid whitespace': function () {
			assert.equal(false, v.addr_s('address with spaces'));
		},
		'invalid *': function () {
			assert.equal(false, v.addr_s('addresswith*'));
		},
		'should not contain #': function () {
			assert.equal(false, v.addr_s('addresswith#'));
		},
		'should not contain ,': function () {
			assert.equal(false, v.addr_s('addresswith,'));
		},
		'should not contain /': function () {
			assert.equal(false, v.addr_s('addresswith/'));
		},
		'should not contain ?': function () {
			assert.equal(false, v.addr_s('addresswith?'));
		},
		'should not contain [': function () {
			assert.equal(false, v.addr_s('addresswith['));
		},
		'should not contain ]': function () {
			assert.equal(false, v.addr_s('addresswith]'));
		},
		'should not contain {': function () {
			assert.equal(false, v.addr_s('addresswith{'));
		},
		'should not contain }': function () {
			assert.equal(false, v.addr_s('addresswith}'));
		}
	},
	'OSC tag': {
		topic: null,
		'should start with ,': function () {
			assert.equal(true, v.tag(',iii'));
		},
		'should contain only legal chars': function () {
			assert.equal(false, v.tag(',abc'));
		}
	},
	'Extract': {
		topic: null,
		'extracts address path': function () {
			assert.deepEqual(['an', 'osc', 'address'], Extract.addr('/an/osc/address'));
		},
		'matches {words}': function () {
			assert.deepEqual(Extract.brackets('{a,word,here}'), ['a', 'word', 'here']);
		},
		'should not match {words': function () {
			assert.deepEqual(Extract.brackets('{a,word,here'), []);
		}
	}
}).export(module);
