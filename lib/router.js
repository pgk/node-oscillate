var Validate = require('./validate').Validate;
var Extract = require('./validate').Extract;
var _u  = require('./underscore');

exports.Route = Route;

function Route(address) {
	this.address = (runValidation(Extract.address(address), Validate.addressSymbol) === false) ? false : address;
	this.callbacks = [];
};

var runValidation = function (ry, func) {
	valid = true;
	for (var i = 0; i < ry.length; i++) {
		valid = valid && func.call(null, ry[i]);
	}
	return valid;
};