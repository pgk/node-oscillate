var Server = require('./../oscillate').oscillate.Server;

var s = new Server(7377, 7374, '127.0.0.1', true);

s.on('/foo/bar', function (arr) {
	console.log('bar: ' + arr[1]);
});
s.on('/foo/baz', function (arr) {
	console.log('baz: ' + arr[1]);
});

s.run();