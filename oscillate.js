var buffer = require('buffer'),
	dgram  = require('dgram'),
	util   = require('util'),
	jspack = require('jspack').jspack;

var tags = {',i':true, ',f':true, ',s':true, ',b':true};

OSCMessage = function (address, tag) {
	this.args = Array.prototype.slice.call(arguments, 2) || [];
	this.address = "" + address || "";
	this.tag = "," + tag || "";
};

OSCMessage.prototype.validateAddress = function() {
	return this.address.slice(0,1) === '/'
};

OSCMessage.prototype.validateTag = function() {
	return tags[this.tag] === true;
};

OSCMessage.prototype.formatOSC = function () {
}

exports.OSCMessage = OSCMessage;