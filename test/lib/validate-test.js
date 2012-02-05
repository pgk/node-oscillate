var vows = require('vows'),
    assert = require('assert');

var	Validate = require('./../../lib/validate').Validate;
var Extract = require('./../../lib/validate').Extract;

vows.describe('OSC Validate:').addBatch({
	'OSC Address Name': {
		topic: null,
		'should not contain white spaces': function (topic) {
			assert.equal(false, Validate.addressSymbol('address with spaces'));
		},
		'should not contain *': function (topic) {
			assert.equal(false, Validate.addressSymbol('addresswith*'));
		},
		'should not contain #': function (topic) {
			assert.equal(false, Validate.addressSymbol('addresswith#'));
		},
		'should not contain ,': function (topic) {
			assert.equal(false, Validate.addressSymbol('addresswith,'));
		},
		'should not contain /': function (topic) {
			assert.equal(false, Validate.addressSymbol('addresswith/'));
		},
		'should not contain ?': function (topic) {
			assert.equal(false, Validate.addressSymbol('addresswith?'));
		},
		'should not contain [': function (topic) {
			assert.equal(false, Validate.addressSymbol('addresswith['));
		},
		'should not contain ]': function (topic) {
			assert.equal(false, Validate.addressSymbol('addresswith]'));
		},
		'should not contain {': function (topic) {
			assert.equal(false, Validate.addressSymbol('addresswith{'));
		},
		'should not contain }': function (topic) {
			assert.equal(false, Validate.addressSymbol('addresswith}'));
		}
	},
	'OSC tag': {
		topic: null,
		'should start with ,': function (topic) {
			assert.equal(true, Validate.tag(',iii'));
		},
		'should contain only legal chars': function (topic) {
			assert.equal(false, Validate.tag(',abc'));
		}
	},
	'Extract': {
		topic: null,
		'should extract address components': function (topic) {
			assert.deepEqual(['an', 'osc', 'address'], Extract.address('/an/osc/address'));
		},
		'matches {words}': function () {
			assert.deepEqual(Extract.fromBrackets('{a,word,here}'), ['a', 'word', 'here']);
		},
		'should not match {words': function () {
			assert.deepEqual(Extract.fromBrackets('{a,word,here'), []);
		}
	}
}).export(module);
