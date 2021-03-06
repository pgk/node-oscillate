var router = require('./router'),
	convert = require('./convert'),
	osc = require('./datatypes');
	buffer = require('buffer');


var OSCMessage = osc.OSCMessage;


var OSCNode = function(port, clientPort, host, debug) {
	this.port = port || 7000;
	this.clientPort = clientPort || this.port + 16;
	this.debug = debug;
	this.host = host;
	this.sock = null;
	this.clientHost = host;
	this.router = new router.Router();
	this.decoder = new convert.Decoder();
	this._initialized = false;
}


var resolutionStrategy = function (msg, rinfo) {

	var msgArray = this.decoder.decode(msg),
		routes = this.router.resolve(msgArray.shift(), msgArray),
		routesFound = routes.length,
		args = this.router.lastArgs,
		_this = this,
		context = {
			send: function (message) {
				return _this.send();
			}
		};

	if (routesFound) {
		for (var i = 0; i < routesFound; i++) {
			routes[i].execute(context, args);
		}
		this.clientHost = rinfo.address;
		// this.send('/server/success', 1);
	} else {
		console.log('Can not resolve osc address: ' + msgArray.shift());
	}

	if (this.debug) {
		console.log('got ' + msg + ' from ' + rinfo.address + ':' + rinfo.port);
	}
}


OSCNode.prototype.setTransport = function (transport) {
	this.transport = transport;
	return this.transport;
};


OSCNode.prototype.getSock = function () {
	if (!this._initialized) {
		this._initialized = true;
		this.transport.on('connect', function (sock) {
			var rinfo = sock.address();
			console.log('listening on ' + rinfo.host + ':' + rinfo.port);
			this._connected = true;
		}.bind(this));
		this.transport.on('close', function () {
			console.log('transport closed');
			this.emit('close');
			// process.exit(0);
		}.bind(this));
		this.transport.connect(this.port, this.host);
	}

	return this.transport;
};


OSCNode.prototype.run = function () {
	var that = this, sock = this.getSock();
	sock.on('data', function (msg, rinfo) {
		resolutionStrategy.apply(that, [msg, rinfo]);
	});
};


OSCNode.prototype.on = function(address, fn) {
	this.router.on(address, fn);
};


OSCNode.prototype.msg = function (msg) {
    var b = new buffer.Buffer(msg.toBinary(), 'binary'),
    	sock = this.getSock();

    return sock.send(b, 0, b.length, this.clientPort, this.clientHost);
};


OSCNode.prototype.send = function () {
    var args = [].slice.call(arguments),
		address = args.shift();
      
    if (this.debug) console.log('sending:', address, args.toString());
    var msgs = new OSCMessage(address), data;
    while(data = args.shift()) {
      if ('undefined' !== typeof data) msgs.append(data);
    }
    this.msg(msgs);
};

exports.Server = exports.Client = OSCNode;
