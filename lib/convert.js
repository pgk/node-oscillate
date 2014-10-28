var types = require('./datatypes'),
    loop = require('./loop');


function Encoder() {
	this.type_map = types.ToOSC;
    this.acceptedTypes = loop.keys(types.FromOSC);
}


Encoder.prototype.encode = function (typehint, type) {
	if (this.acceptedTypes.indexOf(typehint) !== -1) {
		return this.type_map.argument(type, typehint)[1];
    }
	return null;
}


function Decoder() {
	this.type_map = types.FromOSC;
}


Decoder.prototype.decode = function (data) {
    var decoded = [];
    var pair = this.type_map['s'](data);
    var address = pair[0], rest = pair[1];

    if (rest.length > 0) {
        var pair = this.type_map['s'](rest);
        var typetags = pair[0];
        var rest = pair[1];

        decoded.push(address);
        decoded.push(typetags.substr(1));
        if (typetags[0] == ',') {
            for (var t=0; t<typetags.substr(1).length; t++) {
                try {
                  var pair = this.type_map[typetags.substr(1)[t]](rest);
                  rest = pair[1];
                  decoded.push(pair[0]);
                } catch(e) {
                  console.log(e)
                }
            }
        } else {
            console.log('OSC Message typetag-string should start with ,');
        }
    }
    return decoded;
};

exports.Encoder = Encoder;
exports.Decoder = Decoder;
