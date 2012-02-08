var dgram = require('dgram'),
	router = require('router'),
	converters = require('encode');

var Router = router.Router,
	Decoder = converters.Decoder;

function Server(port, host) {
	this.port = port || 7000;
	this.host = host;
	this.sock = null;
	this.router = new Router;
	this.decoder = new Decoder;
}
var msgArray = [];

Server.prototype.run = function () {
	if (this.sock === null) {
		var sock = this.sock = dgram.createSocket('udp4');

		sock.on('message', function (msg, rinfo) {
			msgArray = this.decoder.decode(msg);
			this.router.resolve(msgArray.shift(), msgArray);
			console.log('got ' + msg + ' from ' + rinfo.address + ':' + rinfo.port);
		});

		sock.on('listening', function () {
			var rinfo = sock.address();
			console.log('listening on ' + rinfo.address + ':' + rinfo.port);
		});

		sock.bind(this.port, this.host);
	} else {
		console.log('server already started');
	}
}

exports.Server = Server;
