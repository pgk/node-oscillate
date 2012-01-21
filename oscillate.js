var buffer = require('buffer'),
	dgram  = require('dgram'),
	util   = require('util'),
	jspack = require('jspack').jspack;

var tags = {'i':'i', 'f':'f', 's':'s', 'b':'b'};

exports.OSCMessage = function (address, tag) {
	this.address = "" + address || "";
	this.tag = "," + tag || "";
};

exports.OSCMessage.prototype.validateAddress = function() {
	return this.address.slice(0,1) === '/'
};

exports.OSCMessage.prototype.validateTag = function() {
	return tags[this.tag.slice(1)] !== 'undefined';
};