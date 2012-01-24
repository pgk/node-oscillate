var jspack = require('jspack').jspack;

var _pack = function (str, item) {
	return jspack.Pack(str, [item])
}

exports.OSCTypes = {
	OSCString: function (str) {
	    return _pack('>' + (Math.ceil((str.length + 1) * 0.25) * 4) + 's', str);
	},
	OSCInt: function(num) {
		return _pack('>i', num);
	},
	OSCFloat: function(num) {
		return _pack('>f', num);
	}
};