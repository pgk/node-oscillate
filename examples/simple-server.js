var Server = require('./../lib/server').Server;

var s = new Server(7377, '127.0.0.1');

s.on('/foo/bar', function (arr) {
	console.log('bar: ' + arr[1]);
});
s.on('/foo/baz', function (arr) {
	console.log('baz: ' + arr[1]);
});

s.run();