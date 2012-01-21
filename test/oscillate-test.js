var vows = require('vows'),
    assert = require('assert'),
	oscillate = require('./../oscillate');

var OSCMessage = oscillate.OSCMessage;

vows.describe('OSCMessage:').addBatch({
	'an OSCMessage': {
		topic: new OSCMessage(2, 'b'),
		'has an address': function(topic) {
			assert.equal(topic.address, 2);
		},
		'Has a type tag': function(topic) {
			assert.equal(topic.tag, ',b');
		},
		'Has a validateAddress function': function (topic) {
			assert.notEqual('undefined', topic.validateAddress());
			assert.equal(typeof topic.validateAddress, 'function');
		},
		'validateAddress': {
			topic: new OSCMessage("/foo/bar", 'b'),
			'returns true if address begins with /': function(topic) {
				assert.equal(topic.validateAddress(), true);
			},
			'returns false if address does not begin with /': function(topic) {
				topic.address = 'foo';
				assert.equal(topic.validateAddress(), false);
			}
		},
		'validateTag': {
			topic: new OSCMessage("/foo/bar", 'b'),
			'returns true if tag is valid': function(topic) {
				assert.equal(topic.validateTag(), true);
			}
		}
	}
}).export(module);