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

    // this stores the decoded data as an array
    var decoded = [];

    // we start getting the <address> and <rest> of OSC msg /<address>\0<rest>\0<typetags>\0<data>
    var pair = this.type_map['s'](data);
    var address = pair[0];
    var rest = pair[1];

    // if we have rest, maybe we have some typetags... let see...
    if (rest.length > 0) {
        var pair = this.type_map['s'](rest);
        var typetags = pair[0];
        var rest = pair[1];

        decoded.push(address);
        decoded.push(typetags.substr(1));
        console.log(decoded)
        // typetag-string need to start with the magic ,
        if (typetags[0] == ',') {
            // for each tag...
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
            console.log('OSC Message typetag-string lacks the magic ,');
        }
    }
    return decoded;
};

exports.Encoder = Encoder;
exports.Decoder = Decoder;
