var Client = require('./../lib/server').Client;

var cl = new Client(7374, 15432, '127.0.0.1', true);

setInterval(function() {
	cl.send('/foo/bar', 'hello from osc client');
}, 500);