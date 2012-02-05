var vows = require('vows'),
    assert = require('assert'),
	oscillate = require('./../oscillate'),
	types = require('./../lib/datatypes');

var FromOSC = types.FromOSC;
var OSCMessage = oscillate.OSCMessage,
	OSCString = FromOSC['s'],
	OSCFloat = FromOSC['f'],
	OSCInt = FromOSC['i'];

vows.describe('OSC:').addBatch({
	'OSCMessage': {
		topic: new OSCMessage('/foo'),
		'has an address': function(topic) { assert.equal(topic.address, '/foo'); },
		'Has args array': function(topic) { assert.isArray(topic.args); },
		'args init length 0': function(topic) { assert.equal(topic.args.length, 0); },
		'Has validateAddress': function (topic) {
			assert.notEqual('undefined', topic.validateAddress());
			assert.equal(typeof topic.validateAddress, 'function');
		},
		'Has validateTag': function (topic) {
			assert.notEqual('undefined', topic.validateTag());
		},
		'has formatOSC': function (topic) {
			assert.notEqual('undefined', topic.formatOSC());
		},
		'is not a bundle': function (topic) { assert.equal(false, topic.isbundle()); },
		'.validateAddress': {
			topic: new OSCMessage("/foo/bar", 'b'),
			'returns true if address begins with /': function(topic) {
				assert.equal(topic.validateAddress(), true);
			},
			'returns false if address does not begin with /': function(topic) {
				topic.address = 'foo';
				assert.equal(topic.validateAddress(), false);
			}
		},
		'.append': {
			topic: function () {
				var msg = new OSCMessage("/foo/bar")
				msg.append('i', OSCInt(1))
				return msg;
			},
			'increases length of args by 1': function(topic) {
				assert.equal(topic.args.length, 1);
			},
			'increases length of tags by 1': function(topic) {
				assert.equal(topic.tags.length, 2);
			}
		}
	}
}).export(module);