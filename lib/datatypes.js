var jspack = require('jspack').jspack;

var _pack = function (str, item) {
	return jspack.Pack(str, [item])
}

var _unpack = function (fmt, a, o) {
	return jspack.Unpack(fmt, a, o);
}

exports.FromOSC = {
	's': function(a,o) { return _unpack('>s', a, o); },
	'i': function(a,o) { return _unpack('>i', a, o)},
	'f': function(a,o) {}
};

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
	OSCTimeTag: function (date) {
		//for now, return the 'immediately' timetag (63 bits 0 and one 1)
		return jspack.Pack('!ii', [0,1]);
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
		return null;
	},
	TypeMap: function () {
		return {
			's': this.OSCString,
			'i': this.OSCInt,
			'f': this.OScFloat,
			'b': this.OSCBlob,
			't': this.OScTimeTag,
			'T': this.OSCTrue,
			'F': this.OSCFalse,
			'[': this.OSCArrayOpen,
			']': this.OSCArrayClose,
			'N': this.OSCNil
		};
	}
};
