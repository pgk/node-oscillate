var vows = require('vows'),
    assert = require('assert');

var	Validate = require('./../lib/validate').Validate;

vows.describe('OSC Validate:').addBatch({
	'OSC Address Symbol': {
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
	}
}).export(module);
