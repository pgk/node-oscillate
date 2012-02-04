var vows = require('vows'),
    assert = require('assert'),
	router = require('./../lib/router');

var Route = router.Route;
var Router = router.Router;

vows.describe('Router and Routes').addBatch({
	'Route': {
		topic: new Route('/my/address$%#@'),
		'constructor: address is false if address invalid': function (topic) {
			assert.equal(false, topic.address);
		} ,
		'constructor: address is the address if address invalid': function () {
			var route = new Route('/my/address');
			assert.equal('/my/address', route.address);
		},
		'constructor: callbacks is empty array': function () {
			var route = new Route('/my/address');
			assert.deepEqual([], route.callbacks);
		},
		'add should add a callback function to callbacks': function () {
			var route = new Route('/foo/bar');
			route.add(function () {});
			assert.equal(route.callbacks.length, 1);
		},
		'execute should execute the function with the args provided': function () {
			var route = new Route('/foo/bar');
			route.add(function (a, b) { return a + b; });
			assert.deepEqual(route.execute('foo', 'bar'), ['foobar']);
		},
		'execute should execute all functions with the args provided': function () {
			var route = new Route('/foo/bar');
			route.add(function (a, b) { return a + b; });
			route.add(function (a, b, c) { return a + b + c; });
			assert.deepEqual(route.execute('foo', 'bar', 'baz'), ['foobar', 'foobarbaz']);
		}
	},
	'Router': {
		topic: new Router,
		'constructor should init routes to empty': function (topic) {
			assert.equal(0, topic.routes.length);
		},
		'on adds route to routes': function (topic) {
			topic.on('/foo/bar', function () {});
			assert.equal(topic.routes.length, 1);
		},
		'resolve should return false if route does not match': function (topic) {
			assert.equal(topic.resolve('/bar/baz'), false);
		},
		'resolve should return route if route does not match': function (topic) {
			assert.notEqual(topic.resolve('/foo/bar'), false);
		}
	}
}).export(module);
