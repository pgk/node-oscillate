var vows = require('vows'),
    assert = require('assert'),
	oscillate = require('./../oscillate');

var OSCMessage = oscillate.OSCMessage,
	OSCString = oscillate.OSCString,
	OSCFloat = oscillate.OSCFloat,
	OSCInt = oscillate.OSCInt;

vows.describe('OSC:').addBatch({
	'OSCString': {
		topic: {
			actual: OSCString('i am a string'),
			expected: [105, 32, 97, 109, 32, 97, 32, 115, 116, 114, 105, 110, 103, 0, 0, 0]
		},
		'should return array': function(topic) {
			assert.isArray(topic.actual);
		},
		'returns array of correct length': function(topic) {
			assert.equal(topic.actual.length, topic.expected.length);
		},
		'array length should be padded': function(topic) {
			foo = OSCString('foo'),
			assert.equal(foo.length, 4);
		},
		'returns correct nums in Array': function(topic) {
			assert.deepEqual(topic.actual, topic.expected);
		}
	},
	'OSCInt': {
		topic: {
			num: OSCInt(12345),
			expected: [ 0, 0, 48, 57 ]
		},
		'should return array': function (topic) {
			assert.isArray(topic.num);
		},
		'array should have length 4': function (topic) {
			assert.equal(topic.num.length, 4);
		},
		'array should have correct byte fields': function (topic) {
			assert.deepEqual(topic.num, topic.expected);
		}
	},
	'OSCFloat': {
		topic: {
			num: OSCFloat(0.12345),
			expected: [ 61, 252, 211, 91 ]
		},
		'should return array': function (topic) {
			assert.isArray(topic.num);
		},
		'array should have length 4': function (topic) {
			assert.equal(topic.num.length, 4);
		},
		'array should have correct byte fields': function (topic) {
			assert.deepEqual(topic.num, topic.expected);
		}
	},
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