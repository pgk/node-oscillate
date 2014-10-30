var assert = require('chai').assert,
	OSC = require('./../oscillate');

describe('oscillate', function () {
	describe('message', function () {
		it('creates an OSCMessage', function () {
			assert.equal(OSC.message('/recipient').message.length, 0);
		});
		it('creates an OSCMessage and adds arguments if present', function () {
			assert.equal(OSC.message('/recipient', 'argument').message.length, 12);
		});
	});
});