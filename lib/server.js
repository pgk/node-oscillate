var dgram = require('dgram'),
	router = require('./router'),
	convert = require('./convert'),
	osc = require('./datatypes');
	buffer = require('buffer');

var Router = router.Router,
	Decoder = convert.Decoder,
	Encoder = convert.Encoder,
	OSCMessage = osc.OSCMessage;

var Client = function (port, bindPort, host, debug) {
    var self = this;
    this.debug = debug;
    this._callbacks = [];
    this.port = port;
    this.host = host;
    this._sock = dgram.createSocket('udp4');
    this._sock.bind(bindPort);    
    this._sock.on('message', function (msg, rinfo) {
        var decoded = Decoder.decode(msg);
        for (var c=0; c<self._callbacks.length; c++) {
            if (self._callbacks[c] && address_matches(decoded[0], self._callbacks[c].address)) {
                self._callbacks[c].callback(decoded[0], decoded.slice(2));
            }
        }
    });
}

Client.prototype = {
    msg: function (msg) {
        var b = new buffer.Buffer(msg.toBinary(), 'binary');
        this._sock.send(b, 0, b.length, this.port, this.host);
    },
    send: function () {
        var args = [].slice.call(arguments),
        address = args.shift();
          
        if (this.debug) console.log('sending:', address, args.toString());
        var msgs = new OSCMessage(address);
        var data;
        while(data = args.shift()) {
          if ('undefined' !== typeof data) msgs.append(data);
        }
        this.msg(msgs);
    }
}

exports.Client = Client;


var Server = function(port, host) {
	this.port = port || 7000;
	this.host = host;
	this.sock = null;
	this.router = new Router();
	this.decoder = new Decoder();
}
var msgArray = [];

Server.prototype.run = function () {
	if (this.sock === null) {
		var that = this,
			sock = this.sock = dgram.createSocket('udp4');

		sock.on('message', function (msg, rinfo) {
			var msgArray = that.decoder.decode(msg);
			var routes = that.router.resolve(msgArray.shift(), msgArray);
			var routesFound = routes.length,
				args = that.router.lastArgs;

			if (routesFound !== 0) {
				for (var i = 0; i < len; i++) {
					routes[i].execute(args)
				}
			}
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
},

Server.prototype.on = function(address, fn) {
	this.router.on(address, fn);
}

exports.Server = Server;
