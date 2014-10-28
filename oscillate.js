var server = require('./lib/server'),
	datatypes = require('./lib/datatypes');

var slice = Array.prototype.slice;


module.exports = {
	Server: server.Server,
	Client: server.Client,
	server: function () {
	},
	client: function () {
	},
	message: function (address) {
		var msg = new datatypes.OSCMessage(address),
			rest = slice.call(arguments, 1);

		if (rest && rest.length == 2) {
			var arg = rest[0],
				typehint = rest[1];

			msg.append(arg, typehint);
		}

		return msg;
	}
};
