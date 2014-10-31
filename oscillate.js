var server = require('./lib/server'),
	datatypes = require('./lib/datatypes');


var OSCMessage = datatypes.OSCMessage;


var message = function () {
	return OSCMessage.create.apply(null, arguments);
};


message.decode = OSCMessage.decode;


message.encode = OSCMessage.encode;


module.exports = {
	Server: server.Server,
	Client: server.Client,
	node: function (type, options) {
	},
	message: message
};
