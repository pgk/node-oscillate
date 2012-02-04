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

var filter = function (ar, fn) {
	var arr = [];
	forEach(ar, function (i) { if (fn.call(null, i) === true) { arr[arr.length] = i; } });
	return arr;
}

var matchRoutes = function (address, routes) {
	radd = '^' + address;
	re = new RegExp(radd);
	return filter(routes, function (route) { return re.test(route.address); });
}

exports.Router = Router;

function Router() {
	this.routes = [];
}

Router.prototype.on = function(address, fn) {
	var route = new Route(address);
	this.routes[this.routes.length] = route.add(fn);
}

Router.prototype.resolve = function (address) {
	return matchRoutes(address, this.routes);
}
