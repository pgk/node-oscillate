var util   = require('util'),
	types  = require('./lib/datatypes'),
	convert = require('./lib/convert');

var tags = {',i':true, ',f':true, ',s':true, ',b':true};
var ToOSC = types.ToOSC;

var OSCMessage = function (address) {
	this.message = [];
	this.address = "" + address || "/";
	this.typetags = ",";
};

OSCMessage.prototype = {
    append: function (arg, typehint) {
	    if (arg instanceof Array) {
	        for (var i in arg) {
	            this.append(arg[i], typehint);
	        }
	        return null;
	    }
	    if (typeof(arg) == 'object') {
	        for (var k in arg) {
	            this.append([k, arg[k]]);
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
	        rv = ToOSC.argument(arg, typehint);
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
	this.bundle = true;
};

OSCBundle.prototype = {
	append: function (arg, typehint) {
	    var binary;
	    if (arg instanceof Message) {
	        binary = OSCBlob(arg.toBinary());
	    } else {
	        var msg = Message(this.address);
	        if (typeof(arg) == 'Object') {
	            if (arg.addr) {
	                msg.address = arg.addr;
	            }
	            if (arg.args) {
	                msg.append(arg.args, typehint);
	            }
	        } else {
	            msg.append(arg, typehint);
	        }
	        binary = OSCBlob(msg.toBinary());
	    }
	    this.message += binary;
	    this.typetags += 'b';
	},
	toBinary: function () {
	    var binary = OSCString('#bundle');
	    binary = binary.concat(OSCTimeTag(this.timetag));
	    binary = binary.concat(this.message);
	    return binary;
	}
};

util.inherits(OSCBundle, OSCMessage);

exports.OSCMessage = OSCMessage;
exports.OSCBundle = OSCBundle;
