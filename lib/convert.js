var types = require('./datatypes');

function Encoder() {
	this.type_map = types.ToOSC;
}

Encoder.prototype.to_b = function (typehint, type) {
	if (typeof this.type_map[typehint] !== 'undefined') {
		return this.type_map[typehint](type);
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
