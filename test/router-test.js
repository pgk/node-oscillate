var vows = require('vows'),
    assert = require('assert'),
	Route = require('./../lib/router').Route;

vows.describe('Routes and Routes').addBatch({
	'Route': {
		topic: new Route('/my/address$%#@'),
		'constructor: address is false if address invalid': function (topic) {
			assert.equal(false, topic.address);
		} ,
		'constructor: address is the address if address invalid': function (topic) {
			var route = new Route('/my/address');
			assert.equal('/my/address', route.address);
		},
		'constructor: callbacks is empty array': function (topic) {
			var route = new Route('/my/address');
			assert.deepEqual([], route.callbacks);
		}
	}
}).export(module);
