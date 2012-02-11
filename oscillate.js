var util   = require('util'),
	types  = require('./lib/datatypes'),
	convert = require('./lib/convert');

var ToOSC = types.ToOSC;

var OSCMessage = function (address) {
	this.message = [];
	this.address = "" + address || "/";
	this.typetags = ",";
};

OSCMessage.prototype = {
    append: function (arg, typehint) {
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
	    var binary = ToOSC.string('#bundle');
	    binary = binary.concat(ToOSC.time_tag(this.timestamp));
	    binary = binary.concat(this.message);
	    return binary;
	}
};

exports.OSCMessage = OSCMessage;
exports.OSCBundle = OSCBundle;
