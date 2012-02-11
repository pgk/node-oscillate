var vows = require('vows'),
    assert = require('assert'),
	oscillate = require('./../oscillate'),
	types = require('./../lib/datatypes');

var ToOSC = types.ToOSC;
var OSCMessage = oscillate.OSCMessage,
	OSCBundle = oscillate.OSCBundle;

vows.describe('OSC:').addBatch({
	'OSCMessage': {
		topic: new OSCMessage('/foo'),
		'has an address': function(topic) { assert.equal(topic.address, '/foo'); },
		'Has args array': function(topic) { assert.isArray(topic.message); },
		'args init length 0': function(topic) { assert.equal(topic.message.length, 0); },
		'.append': {
			topic: function () {
				var msg = new OSCMessage("/foo/bar")
				msg.append(1, 'i')
				return msg;
			},
			'increases length of args by 4': function(topic) {
				assert.equal(topic.message.length, 4);
			},
			'increases length of tags by 1': function(topic) {
				assert.equal(topic.typetags.length, 2);
			},
			'toBinary returns array of all elements': function(topic) {
				assert.deepEqual(topic.toBinary(), [ 47, 102, 111, 111, 47, 98, 97, 114, 0, 0, 0, 0, 44, 105, 0, 0, 0, 0, 0, 1 ]);
			},
			'append object literal': function() {
				var msg = new OSCMessage('/foo/bar');
				msg.append({i:1, j:2});
				assert.equal(3, msg.typetags.length);
			},
			'append array': function () {
				var msg = new OSCMessage('/foo/bar');
				msg.append([1,2,3,'str', 0.1]);
				assert.equal(msg.typetags.length, 6);
				assert.equal(',iiisf', msg.typetags);
			}
		}
	},
	'OSCBundle': {
		'append message': function () {
			var msg = new OSCMessage('/foo/bar'), bundle;
			msg.append(['foo', 'bar', 1, 2, 3.3]);
			bundle = new OSCBundle('/address/one');
			bundle.append(msg);
			assert.equal(2, bundle.typetags.length);
		}
	}
}).export(module);