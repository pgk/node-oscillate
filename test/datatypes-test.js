var vows = require('vows'),
    assert = require('assert'),
	types = require('./../lib/datatypes').OSCTypes;

var	OSCString = types.OSCString,
	OSCFloat = types.OSCFloat,
	OSCInt = types.OSCInt,
	OSCBlob = types.OSCBlob;

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
	},
	'OSCBlob': {
		topic: {
			binary: OSCBlob('0.12345abcdefREWT%$^#^%^'),
			expected: [0,0,0,24,48,46,49,50,51,52,53,97,98,99,100,101,102,82,69,87,84,37,36,94,35,94,37,94]
		},
		'should return array': function (topic) {
			assert.isArray(topic.binary);
		},
		'array should have padded length': function (topic) {
			assert.equal(topic.binary.length, 28);
		},
		'array should have correct byte fields': function (topic) {
			assert.deepEqual(topic.binary, topic.expected);
		}
	},
	'OSCNil': {
		topic: types.OSCNil(),
		'should return null': function (topic) {
			assert.equal(null, topic);
		}
	},
	'OSCTimeTag': {
		topic: function () {
			var _date = new Date();
			return {
				date: _date,
				time: types.OSCTimeTag(_date)
			};
		},
		'should return time now': function (topic) {
			assert.deepEqual([0,0,0,0,0,0,0,1], topic.time);
		}
	}
}).export(module);
