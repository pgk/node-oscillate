var util   = require('util'),
    convert = require('./convert'),
    jspack = require('jspack').jspack;

var _pack = function (str, item) {
    return jspack.Pack(str, [item])
};

var _unpack = function (fmt, a, o) {
    return jspack.Unpack(fmt, a, o);
};

var FromOSC = {
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

exports.FromOSC = FromOSC;

var _handleTypehint = function (next, typehint) {
    var binary, tag;

    try {
        switch (typehint) {
            case 'd':
                binary = _pack('>f', parseFloat(next));
                tag = 'f';
                break;
            case 'f':
                binary = _pack('>f', parseFloat(next));
                tag = 'f';
                break;
            case 'i':
                binary = _pack('>i', parseInt(next));
                tag = 'i';
                break;
            default:
                binary = this.str(next);
                tag = 's';
                break;
        }
    } catch (e) {
        binary = this.str(next);
        tag = 's';
    }

    return [tag, binary];
}

var _inferTypeHint = function (next) {
    var binary, tag;
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
    return [tag, binary];
}

 var ToOSC = {
    str: function (next) {
        return _pack('>' + (Math.ceil((next.length + 1) * 0.25) * 4) + 's', next);
    },
    argument: function (next, typehint) {
        if (!typehint) {
            return _inferTypeHint.call(this, next);
        } else {
            return _handleTypehint.call(this, next, typehint);
        }
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

exports.ToOSC = ToOSC;

var OSCMessage = function (address) {
    this.message = [];
    this.address = "" + address || "/";
    this.typetags = ",";
};

OSCMessage.prototype = {
    append: function (arg, typehint) {
    	var binary, tag;

        if (arg instanceof Array) {
            for (var i=0, len = arg.length; i < len; i++) {
                this.append(arg[i], typehint);
            }
            return null;
        }
        if (typeof(arg) == 'object') {
            for (var k in arg) {
                if (arg.hasOwnProperty(k)) {
                    this.append([arg[k]]);
                }
            }
            return null;
        }
        
        if (typehint == 'b') {
            binary = ToOSC.blob(arg);
            tag = 'b';
        } else if (typehint == 't') {
            binary = ToOSC.time_tag(arg);
            tag = 't';
        } else {
            var rv = ToOSC.argument(arg, typehint);
            tag = rv[0];
            binary = rv[1];
        }
        this.typetags += tag;
        this.message = this.message.concat(binary);
    },
    toBinary: function () {
        var binary = ToOSC.str(this.address);
        binary = binary.concat(ToOSC.str(this.typetags));
        binary = binary.concat(this.message);
        return binary;
    }
};

var OSCBundle = function (address, timestamp) {
    OSCMessage.call(this, address);
    this.timestamp = timestamp || 0;
};

util.inherits(OSCBundle, OSCMessage);

OSCBundle.prototype = {
    append: function (arg, typehint) {
        var binary, blob;
        if (arg instanceof OSCMessage) {
            blob = arg.toBinary();
        } else {
            var msg = OSCMessage(this.address);
            if (typeof(arg) == 'Object') {
                if (arg.addr) {
                    msg.address = arg.addr;
                }
                if (arg.args) {
                    msg.append(arg.args);
                }
            } else {
                msg.append(arg);
            }
            blob = msg.toBinary();
        }
        binary = ToOSC.blob(blob);
        this.message += binary;
        this.typetags += 'b';
    },
    toBinary: function () {
        var binary = ToOSC.str('#bundle');
        binary = binary.concat(ToOSC.time_tag(this.timestamp));
        binary = binary.concat(this.message);
        return binary;
    }
};

exports.OSCMessage = OSCMessage;
exports.OSCBundle = OSCBundle;
