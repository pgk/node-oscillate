var assert = require('chai').assert,
	router = require('./../../lib/router');

var Route = router.Route;
var Router = router.Router;

describe('Router and Routes', function () {

	describe('Route', function () {

		var topic;
		beforeEach(function () {
			topic = new Route('/my/address$%#@');
		});

		describe('constructor', function () {

			it('address is false if address invalid', function () {
				assert.equal(false, topic.address);
			});

			it('address is the address if address invalid', function () {
				var route = new Route('/my/address');
				assert.equal('/my/address', route.address);
			});

			it('callbacks is empty array', function () {
				var route = new Route('/my/address');
				assert.deepEqual([], route.callbacks);
			});

		});
		
		it('Route.add() adds a callback to Route.callbacks', function () {
			var route = new Route('/foo/bar');
			route.add(function () {});
			assert.equal(route.callbacks.length, 1);
		});

		describe('execute', function () {
			it('accepts an array of arguments', function () {
				var route = new Route('/foo/bar');
				route.add(function (a, b) { return a + b; });
				assert.deepEqual(route.execute(['foo', 'bar']), ['foobar']);
			});
			it('accepts an optional context object', function () {
				var route = new Route('/foo/bar'), ctx = {name: 'bar'};
				route.add(function (a, b) { return a + b + this.name; });
				assert.deepEqual(route.execute(ctx, ['foo', 'bar']), ['foobarbar']);
			});
			it('execute should execute the function with the args provided', function () {
				var route = new Route('/foo/bar');
				route.add(function (a, b) { return a + b; });
				assert.deepEqual(route.execute(['foo', 'bar']), ['foobar']);
			});

			it('execute should execute all functions with the args provided', function () {
				var route = new Route('/foo/bar');
				route.add(function (a, b) { return a + b; });
				route.add(function (a, b, c) { return a + b + c; });
				assert.deepEqual(route.execute(['foo', 'bar', 'baz']), ['foobar', 'foobarbaz']);
			});
		});

	});

	describe('Router', function () {

		var topic = new Router;
		beforeEach(function () {
			topic = new Router;
		});


		it('constructor should init routes to empty', function () {
			assert.equal(0, topic.routes.length);
		});

		it('on adds route to routes', function () {
			topic.on('/foo/bar', function () {});
			assert.equal(topic.routes.length, 1);
		});

		it('resolve should return empty array if route does not match', function () {
			assert.deepEqual(topic.resolve('/bar/baz'), []);
		});

		it('resolve should return route if route matches', function () {
			topic.on('/foo/bar', function () {});
			assert.equal(topic.resolve('/foo/bar').length, 1);
		});

		it('resolve should return array of routes matched on wildcards', function() {
			topic.on('/foo/bar', function () {});
			topic.on('/foo/baz', function () {});
			var matched = topic.resolve('/foo/*');
			assert.equal(matched.length, 2);
		});

		it('resolve should return array of routes matched on [abc]', function() {
			topic.on('/foo/bar', function () {});
			topic.on('/foo/baz', function () {});
			var matched = topic.resolve('/foo/ba[rz]');
			assert.equal(matched.length, 2);
		});

		it('resolve should return array of routes matched on ?', function() {
			topic.on('/foo/bar', function () {});
			topic.on('/foo/baz', function () {});
			var matched = topic.resolve('/foo/?a?');
			assert.equal(matched.length, 2);
		});

		it('resolve should return array of routes matched on !', function() {
			topic.on('/foo/bar', function () {});
			topic.on('/foo/baz', function () {});
			var matched = topic.resolve('/foo/?a[!z]');
			assert.equal(matched.length, 1);
		});
	});

});
