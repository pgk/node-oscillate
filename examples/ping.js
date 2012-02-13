var Client = require('./../oscillate').oscillate.Client;

var c = new Client(17374, 7374, '127.0.0.1', true);

setInterval(function() {
	c.send('/foo/bar', 'hello from osc client');
}, 500);