
(function () {

	var dgram = require('dgram'),
		util = require('util'),
		events = require("events");


	function TransportProxy(options) {
		events.EventEmitter.call(this);
		this.opitons = options || {};
	}


	util.inherits(TransportProxy, events.EventEmitter);


	function StringTransport(options) {
		TransportProxy.call(this, options);
		this.outbound = [];
		this.inbound = [];
		this.rinfo = {host: "localhost", port: 123};
	};

	util.inherits(StringTransport, TransportProxy);

	StringTransport.prototype.connect = function () {
		this.emit('connect', this);
	};

	StringTransport.prototype.address = function () {
		return this.rinfo;
	};

	StringTransport.prototype.receive = function (what) {
		this.emit('data', what, this.rinfo);
	};

	StringTransport.prototype.send = function (data) {
		this.outbound.push(data);
	};

	StringTransport.prototype.disconnect = function () {
		this.emit('close');
	};


	var transportFactories = {
		tcp: function (options) {
		},
		udp: function (options) {
			var s = dgram.createSocket('udp4');
			var transport = Object.create({});
			// util.inherits(transport, )
		},
		str: function (options) {
			return new StringTransport(options);
		}
	};


	module.exports = {
		create: function (transportType) {
			var factory = transportFactories[transportType],
				options = Array.prototype.slice.call(arguments, 1);
			if (!factory) {
				throw new Error('invalid transport');
			}
			return factory(options);
		}
	};

}());

