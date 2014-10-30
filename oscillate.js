var server = require('./lib/server'),
	convert = require('./lib/convert'),
	datatypes = require('./lib/datatypes');

var slice = Array.prototype.slice;

var message = function () {
	var args = slice.call(arguments, 0),
		address = args.shift(),
		msg = new datatypes.OSCMessage(address),
		argument;
      
    while(argument = args.shift()) {
      if ('undefined' !== typeof argument) msg.append(argument);
    }

	return msg;
};


message.decode = function (byteArray) {
	return (new convert.Decoder()).decode(byteArray);
};


message.encode = function () {
	var msg = message.apply(null, arguments);
    return new buffer.Buffer(msg.toBinary(), 'binary');
};


module.exports = {
	Server: server.Server,
	Client: server.Client,
	server: function () {
	},
	client: function () {
	},
	message: message
};
