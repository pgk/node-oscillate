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
        var args = Array.prototype.slice.call(arguments),
            ctx = (args.length > 1) ? args.shift() : null;

        return this.callbacks.map(function(f) { return f.apply(ctx, args[0]); });
    }
};

var runValidation = function (ry, func) {
    var valid = true;
    ry.forEach(function(address) {
        valid = valid && func.call(null, address)
    });
    return valid;
};

var filter = function (ar, fn) {
    var arr = [];
    ar.forEach(function (i) { if (fn.call(null, i) === true) { arr[arr.length] = i; } });
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
};

Router.prototype.resolve = function (address, args) {
    this.lastArgs = args;
    return matchRoutes(address, this.routes);
};
