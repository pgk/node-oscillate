var vows = require('vows'),
    assert = require('assert'),
	datatypes = require('./../lib/datatypes');

var	OSCString = datatypes.OSCString,
	OSCFloat = datatypes.OSCFloat,
	OSCInt = datatypes.OSCInt;

vows.describe('OSC Data Types:').addBatch({
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
		'array length should be padded to be multiple of 4': function(topic) {
			foo = OSCString('foobar'),
			assert.equal(foo.length % 4, 0);
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
	}
}).export(module);