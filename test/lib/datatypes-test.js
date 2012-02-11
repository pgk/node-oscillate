var vows = require('vows'),
    assert = require('assert'),
	types = require('./../../lib/datatypes');

var	ToOSC = types.ToOSC;

vows.describe('From/To OSC:').addBatch({
	'String': {
		topic: {
			actual: ToOSC.str('i am a string'),
			expected: [105, 32, 97, 109, 32, 97, 32, 115, 116, 114, 105, 110, 103, 0, 0, 0]
		},
		'should return array, with correct length and bytefields': function(topic) {
			assert.isArray(topic.actual);
			assert.equal(topic.actual.length, topic.expected.length);
			foo = ToOSC.str('foobar'),
			assert.equal(foo.length % 4, 0);
		},
		'returns correct nums': function(topic) {
			assert.deepEqual(topic.actual, topic.expected);
		}
	},
	'Int': {
		topic: {
			num: ToOSC.argument(12345),
			expected: [ 0, 0, 48, 57 ]
		},
		'should return array, with correct length and bytefields': function (topic) {
			assert.isArray(topic.num[1]);
			assert.equal(topic.num[1].length, 4);
			assert.deepEqual(topic.num[1], topic.expected);
		}
	},
	'Float': {
		topic: {
			num: ToOSC.argument(0.12345) 
		},
		'should return array, with correct length and bytefields': function (topic) {
			assert.isArray(topic.num[1]);
			assert.equal(topic.num[1].length, 4);
			assert.deepEqual(topic.num[1], [ 61, 252, 211, 91 ]);
		}
	},
	'Blob': {
		topic: {
			binary: ToOSC.blob('0.12345abcdefREWT%$^#^%^'),
			expected: [0,0,0,24,48,46,49,50,51,52,53,97,98,99,100,101,102,82,69,87,84,37,36,94,35,94,37,94]
		},
		'should return array, with correct length and bytefields': function (topic) {
			assert.isArray(topic.binary);
			assert.equal(topic.binary.length, 28);
			assert.deepEqual(topic.binary, topic.expected);
		}
	},
	'OSCTimeTag': {
		'should return time now': function () {
			var date = new Date(),
				time = ToOSC.time_tag(date);
			assert.deepEqual([0,0,0,0,0,0,0,1], time);
		}
	},
	'with typehints': function () {
		var num = ToOSC.argument(12345, 'i'),
			flo = ToOSC.argument(0.12345, 'f'),
			dbl = ToOSC.argument(0.12345, 'd'),
			str = ToOSC.argument('i am a string', 's');
		assert.deepEqual(num[1], [ 0, 0, 48, 57 ]);
		assert.deepEqual(flo[1], [ 61, 252, 211, 91 ]);
		assert.deepEqual(dbl[1], [ 61, 252, 211, 91 ]);
		assert.deepEqual(str[1], [105, 32, 97, 109, 32, 97, 32, 115, 116, 114, 105, 110, 103, 0, 0, 0]);
	}
}).export(module);
