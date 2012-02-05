var vows = require('vows'),
    assert = require('assert'),
    Encoder = require('./../../lib/encoder').Encoder;

vows.describe('Encoder').addBatch({
	'Encoder': {
		topic: function() {
			return function (typehint, type) {
				var enc = new Encoder;
				return enc.to_b(typehint, type);
			}
		},
		'should encode type if exists': function(topic) {
			assert.deepEqual(topic('i', 1), [ 0, 0, 0, 1 ]);
		},
		'should not encode type if does not exist': function(topic) {
			assert.equal(topic('z', 1), null);
		}
	}
}).export(module);