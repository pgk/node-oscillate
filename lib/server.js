var dgram = require('dgram');
SERVER_HOST = '0.0.0.0';
SERVER_PORT = 7000;

var server = dgram.createSocket('udp4');

server.on('message', function (msg, rinfo) {
	console.log('got ' + msg + ' from ' + rinfo.address + ':' + rinfo.port);
});

server.on('listening', function () {
	var rinfo = server.address();
	console.log('listening on ' + rinfo.address + ':' + rinfo.port);
});

server.bind(SERVER_PORT, SERVER_HOST);
