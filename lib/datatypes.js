var jspack = require('jspack').jspack;

var _pack = function (str, item) {
	return jspack.Pack(str, [item])
};

var _unpack = function (fmt, a, o) {
	return jspack.Unpack(fmt, a, o);
};

exports.FromOSC = {
	's': function (data) {
	    var data = data.toString('utf8');
	    var length = data.search('\0');
	    var nextData = parseInt(Math.ceil((length + 1) / 4.0) * 4);
	    return [data.substring(0, length), data.substr(nextData)];
	},
	'i': function (data) {
	    if (data.length < 4) {
	        console.log('Error: too few bytes for int ' + data + data.length);
	        rest = data;
	        value = 0;
	    } else {
	        value = jspack.Unpack('>i', new Buffer(data.substring(0,4)));
	        if (value == undefined) {
	            value = 0;
	        }
	        rest = data.substr(4);
	    }
	    return [value, rest];
	},
	'f': function (data) {
	    if (data.length < 4) {
	        console.log('Error: too few bytes for float ' + data + data.length);
	        return [0, data];
	    } else {
	        value = jspack.Unpack('>f', new Buffer(data.substring(0,4)));
	        if (value == undefined) {
	            value = 0;
	        }
	        rest = data.substr(4);
	    }
	    return [value, rest];
	},
	'b': function (data) {
	    var length = jspack.Unpack('>i', new Buffer(data.substring(0,4)));
	    var nextData = parseInt(Math.ceil((length) / 4.0) * 4) + 4;
	    return [data.substring(4, length + 4), data.substr(nextData)]
	},
	'd': function (data) {
		if (data.length < 8) {
			console.log(data);
			console.log('Error: too few bytes for double ' + data + data.length);
			rest = data;
			value = 0;
	    } else {
			value = jspack.Unpack('>d', new Buffer(data.substring(0,8)));
			if (value == undefined) {
				value = 0;
	        }
	        rest = data.substr(8);
		}
		return [value, rest];
	}
};

var pad = function (length) {
	return Math.ceil((next.length + 1) * 0.25) * 4;
}

exports.ToOSC = {
	that: this,
	str: function (next) {
	    return _pack('>' + (Math.ceil((next.length + 1) * 0.25) * 4) + 's', next);
	},
	argument: function (next, typehint) {
	    var binary, tag;
	    if (!typehint) {
	        if (typeof(next) == 'number') {
	            if (next.toString().indexOf('.') != -1) {
	                binary = _pack('>f', next);
	                tag = 'f';
	            } else {
	                binary = _pack('>i', next);
	                tag = 'i';
	            }
	        } else {
	            binary = this.str(next);
	            tag = 's';
	        }
	    } else if (typehint == 'd') {
	        try {
	            binary = _pack('>f', parseFloat(next));
	            tag = 'f';
	        } catch (e) {
	            binary = this.str(next);
	            tag = 's';
	        }
	    } else if (typehint == 'i') {
	        try {
	            binary = _pack('>i', parseInt(next));
	            tag = 'i';
	        } catch (e) {
	            binary = this.str(next);
	            tag = 's';
	        }
	    } else if (typehint == 'f') {
	        try {
	            binary = _pack('>f', parseFloat(next));
	            tag = 'i';
	        } catch (e) {
	            binary = this.str(next);
	            tag = 's';
	        }
	    } else {
	        binary = this.str(next);
	        tag = 's';
	    }
	    return [tag, binary];
	},
	blob: function (next) {
	    var binary = '';
	    if (typeof(next) == 'string') {
	        var len = Math.ceil((next.length) / 4.0) * 4;
	        binary = jspack.Pack('>i' + len + 's', [len, next]);
	    }
	    return binary;
	},
	time_tag: function (date) {
		return jspack.Pack('!LL', [0,1]);
	}
};
