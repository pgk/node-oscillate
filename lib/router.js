var Validate = require('./validate').Validate;
var Extract = require('./validate').Extract;

exports.Route = Route;

function Route(address) {
	this.address = (runValidation(Extract.addr(address), Validate.addr_s) === false) ? false : address;
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
	var r = '^' + address;
	r = r.replace('?', '.');
	r = r.replace('!', '^');
	var re = new RegExp(r);
	return filter(routes, function (route) { return re.test(route.address); });
}

exports.Router = Router;

function Router() {
	this.routes = [];
	this.lastArgs = null;
}

Router.prototype.on = function(address, fn) {
	var route = new Route(address);
	this.routes[this.routes.length] = route.add(fn);
}

Router.prototype.resolve = function (address, args) {
	this.lastArgs = args;
	return matchRoutes(address, this.routes);
}
