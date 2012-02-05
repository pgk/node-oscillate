var types = require('./datatypes');

function Encoder() {
	this.type_map = types.OSCTypes.TypeMap();
}

Encoder.prototype.to_b = function (typehint, type) {
	if (typeof this.type_map[typehint] !== 'undefined') {
		return this.type_map[typehint](type);
	}
	return null;
}

exports.Encoder = Encoder;