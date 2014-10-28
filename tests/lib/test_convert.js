var assert = require('chai').assert,
    Encoder = require('./../../lib/convert').Encoder;

describe('Encoder', function () {

	var toByteArray = function (typehint, type) {
		var enc = new Encoder;
		return enc.encode(typehint, type);
	};

	it('should encode type if exists', function() {
		assert.equal(toByteArray('i', 1), [0, 0, 0, 1]);
	});

	it('should not encode type if does not exist', function() {
		assert.equal(toByteArray('z', 1), null);
	});

});
