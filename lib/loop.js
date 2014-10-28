
var hasProp = function (obj, k) { return Object.prototype.hasOwnProperty.call(obj, k); };

module.exports = {
	keys: function (object) {
		var keys = [], k;
		for (k in object) {
			if (hasProp(object, k)) {
				keys.push(k);
			}
		}
		return keys;
	}
};

