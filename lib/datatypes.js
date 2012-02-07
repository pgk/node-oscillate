var jspack = require('jspack').jspack;

var _pack = function (str, item) {
	return jspack.Pack(str, [item])
};

var _unpack = function (fmt, a, o) {
	return jspack.Unpack(fmt, a, o);
};

exports.FromOSC = {
	's': function(a,o) { return _unpack('>s', a, o); },
	'i': function(a,o) { return _unpack('>i', a, 4)},
	'f': function(a,o) { return _unpack('>f', a, 4)},
	'b': function(a,o) {},
	't': function(a,o) {}
};

exports.ToOSC = {
	's': function (str) {
	    return _pack('>' + (Math.ceil((str.length + 1) * 0.25) * 4) + 's', str);
	},
	'i': function(num) {
		return _pack('>i', num);
	},
	'f': function(num) {
		return _pack('>f', num);
	},
	'b': function (data) {
		var length = Math.ceil((data.length) * 0.25) * 4.0;
		return jspack.Pack('>i' + length + 's', [length, data]);
	},
	't': function (date) {
		return jspack.Pack('!ii', [0,1]);
	}
};
