var Validate = require('./validate').Validate;
var Extract = require('./validate').Extract;
var _u  = require('./underscore');

exports.Route = Route;

function Route(address) {
	this.address = (runValidation(Extract.address(address), Validate.addressSymbol) === false) ? false : address;
	this.callbacks = [];
};

Route.prototype = {
	add: function(callback) {
		this.callbacks[this.callbacks.length] = callback;
		return this;
	},
	execute: function () {
		args = Array.prototype.slice.apply(arguments);
		ry = [];
		forEach(this.callbacks, function(fn) {
			ry[ry.length] = fn.apply(null, args);
		});
		return ry;
	}
};

var runValidation = function (ry, func) {
	valid = true;
	forEach(ry, function(address) {
		valid = valid && func.call(null, address)
	});
	return valid;
};

var forEach = function (ar, fn) {
	for (var i = 0; i < ar.length; i++) {
		fn.call(null, ar[i]);
	}
}