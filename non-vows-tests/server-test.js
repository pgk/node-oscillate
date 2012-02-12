var assert = require('assert'),
    lib = require('./../../lib/server');

var Server = lib.Server,
	Client = lib.Client;

var mksrv = function () {
	var s = new Server(7377, '127.0.0.1');
	var res = null;

	s.on('/foo/bar', function (arr) {
		res = 'bar: ' + arr[1];
		console.log(res);
		assert.equal(res, 'bar: hello');
	});
	s.on('/foo/baz', function (arr) {
		res = 'baz: ' + arr[1];
		console.log(res);
		assert.equal(res, 'baz: hello');
	});
	s.on('/server/close', function (arr) {
		s.stop();
	});
	return {
		resp: res,
		srv: s
	};
};

var c = new Client(7377, 15432, '127.0.0.1', true);
var ss = mksrv();
ss.srv.run();
c.send('/foo/bar', 'hello');
c.send('/foo/baz', 'hello');
c.send('/foo/ba?', 'hello');
c.send('/foo/*', 'hello');
c.send('/server/close', 'hello');
			