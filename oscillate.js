var buffer = require('buffer'),
	dgram  = require('dgram'),
	util   = require('util'),
	_u	   = require('./lib/underscore.js').noConflict(),
	types  = require('./lib/datatypes').jspack;

var tags = {',i':true, ',f':true, ',s':true, ',b':true};

OSCMessage = function (address) {
	this.args = [];
	this.address = "" + address || "/";
	this.tags = ",";
};

OSCMessage.prototype = {
	validateAddress: function() {
		return this.address.slice(0,1) === '/'
	},
	validateTag: function() {
		return tags[this.tag] === true;
	},
	formatOSC: function () {
	},
	append: function (type, param) {
		this.args[this.args.length] = param;
		this.tags = this.tags + type;
	},
	isbundle: function () {
		return false;
	}
};

exports.OSCMessage = OSCMessage;