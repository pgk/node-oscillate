var server = require('./../../lib/server'),
	transports = require('./../../lib/transports'),
	OSC = require('./../../oscillate'),
	assert = require('chai').assert;

var convert = require('./../../lib/convert');

describe('Server', function () {

	var makeServer = function () {
		var s = new server.Server(),
			transport = transports.create('str');

		s.setTransport(transport);
		s.run();
		return s;
	};

	describe('transport', function () {

		it('can be set', function () {
			var s = new server.Server();
			var transport = transports.create('str');
			s.setTransport(transport);
			assert.isNotNull(s.transport);
		});

		it('connects', function () {
			var s = makeServer();
			assert.equal(s._connected, true);
		});
	});


	describe('server routes', function () {
		// Fails
		// it('callback if valid message sent', function (done) {
		// 	var osc = makeServer();

		// 	osc.on('/noteon', function (typehints, note, velocity) {
		// 		console.log(arguments);
		// 		assert.equal(note, 64);
		// 		done();
		// 	});

		// 	osc.transport.receive(OSC.message.encode("/noteon", 64, 127));

		// });
	});

});

