var jspack = require('jspack').jspack;

var _pack = function (str, item) {
	return jspack.Pack(str, [item])
}

var OSCString = function (str) {
    return _pack('>' + (Math.ceil((str.length + 1) * 0.25) * 4) + 's', str);
}

exports.OSCString = OSCString;

var OSCInt = function(num) {
	return _pack('>i', num);
}

exports.OSCInt = OSCInt;

var OSCFloat = function(num) {
	return _pack('>f', num);
}

exports.OSCFloat = OSCFloat;