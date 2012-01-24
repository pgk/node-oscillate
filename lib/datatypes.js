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
	},
	OSCBlob: function (data) {
		var dataLength = Math.ceil((data.length) * 0.25) * 4.0;
		return jspack.Pack('>i' + dataLength + 's', [dataLength, data]);
	},
	OSCTimeTag: function (time) {
	},
	OSCTrue: function () {
	},
	OSCFalse: function () {
	},
	OSCArrayOpen: function () {
	},
	OSCArrayClose: function () {
	},
	OSCNil: function () {
	},
	TypeMap: function () {
		return {
			's': OSCString,
			'i': OSCInt,
			'f': OScFloat,
			'b': OSCBlob,
			't': OScTimeTag,
			'T': OSCTrue,
			'F': OSCFalse,
			'[': OSCArrayOpen,
			']': OSCArrayClose,
			'N': OSCNil
		};
	}
};