
var hasProp = function (obj, k) { return Object.prototype.hasOwnProperty.call(obj, k); };

var sliceArgs = function (args, index) {
	return Array.prototype.slice.call(args, index);
};

module.exports = {
	sliceArgs: sliceArgs,
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

