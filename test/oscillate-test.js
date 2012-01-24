var vows = require('vows'),
    assert = require('assert'),
	oscillate = require('./../oscillate'),
	datatypes = require('./../lib/datatypes');

var OSCMessage = oscillate.OSCMessage,
	OSCString = datatypes.OSCString,
	OSCFloat = datatypes.OSCFloat,
	OSCInt = datatypes.OSCInt;

vows.describe('OSC:').addBatch({
	'OSCMessage': {
		topic: new OSCMessage('/foo', 'i', 1),
		'has an address': function(topic) {
			assert.equal(topic.address, '/foo');
		},
		'Has a tag': function(topic) {
			assert.equal(topic.tag, ',i');
		},
		'Has zero or more OSCArguments on arguments': function(topic) {
			assert.isArray(topic.args);
		},
		'arguments has length of 1': function(topic) {
			assert.equal(topic.args.length, 1);
		},
		'Has validateAddress': function (topic) {
			assert.notEqual('undefined', topic.validateAddress());
			assert.equal(typeof topic.validateAddress, 'function');
		},
		'Has validateTag': function (topic) {
			assert.notEqual('undefined', topic.validateTag());
		},
		'has formatOSC': function (topic) {
			assert.notEqual('undefined', topic.formatOSC());
		},
		'.validateAddress': {
			topic: new OSCMessage("/foo/bar", 'b'),
			'returns true if address begins with /': function(topic) {
				assert.equal(topic.validateAddress(), true);
			},
			'returns false if address does not begin with /': function(topic) {
				topic.address = 'foo';
				assert.equal(topic.validateAddress(), false);
			}
		},
		'.validateTag': {
			topic: new OSCMessage("/foo/bar", 'b'),
			'returns true if tag is valid': function(topic) {
				assert.equal(topic.validateTag(), true);
			},
			'returns false if tag is invalid': function(topic) {
				topic.tag = ',e';
				assert.equal(topic.validateTag(), false);
			}
		}
	}
}).export(module);