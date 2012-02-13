var dgram = require('dgram'),
	router = require('./router'),
	convert = require('./convert'),
	osc = require('./datatypes');
	buffer = require('buffer');

var Router = router.Router,
	Decoder = convert.Decoder,
	Encoder = convert.Encoder,
	OSCMessage = osc.OSCMessage;

var Server = function(port, clientPort, host, debug) {
	this.port = port || 7000;
	this.clientPort = clientPort || this.port + 16;
	this.debug = debug;
	this.host = host;
	this.sock = null;
	this.clientHost = host;
	this.router = new Router();
	this.decoder = new Decoder();
}

var resolutionStrategy = function (msg, rinfo) {
	var msgArray = this.decoder.decode(msg);
	var routes = this.router.resolve(msgArray.shift(), msgArray);
	var routesFound = routes.length,
		args = this.router.lastArgs;

	if (routesFound !== 0) {
		for (var i = 0; i < routesFound; i++) {
			routes[i].execute(args);
		}
		this.clientHost = rinfo.address;
		this.send('/server/success', 1);
	} else {
		console.log('Can not resolve osc address: ' + msgArray.shift());
	}
	if (this.debug) console.log('got ' + msg + ' from ' + rinfo.address + ':' + rinfo.port);
}

Server.prototype = {
	getSock: function() {
		if (this.sock === null) {
			this.sock = sock = dgram.createSocket('udp4');
			sock.on('listening', function () {
				var rinfo = sock.address();
				console.log('listening on ' + rinfo.address + ':' + rinfo.port);
			});
			sock.on('close', function () {
				console.log('server closed');
				process.exit(0);
			});
			sock.bind(this.port, this.host);
		}
		return this.sock;
	},
	run: function () {
		var that = this, sock = this.getSock();
		sock.on('message', function (msg, rinfo) {
			resolutionStrategy.apply(that, [msg, rinfo]);
		});
	},
	on: function(address, fn) {
		this.router.on(address, fn);
	},
	msg: function (msg) {
        var b = new buffer.Buffer(msg.toBinary(), 'binary'), sock = this.getSock();
        sock.send(b, 0, b.length, this.clientPort, this.clientHost);
    },
    send: function () {
        var args = [].slice.call(arguments),
			address = args.shift();
          
        if (this.debug) console.log('sending:', address, args.toString());
        var msgs = new OSCMessage(address), data;
        while(data = args.shift()) {
          if ('undefined' !== typeof data) msgs.append(data);
        }
        this.msg(msgs);
    }
};

exports.Server = exports.Client = Server;
