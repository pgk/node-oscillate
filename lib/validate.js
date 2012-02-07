var InvalidAddressSymbol = /\s|\{|\}|\#|\*|\,|\?|\/|\[|\]/;
var addressExtractor = /\/\w+\/s/;
var tagValidator = /\,+[ifsbhtdScrmTFNI]/;

exports.Validate = {
	addr_s: function (address) {
		return !InvalidAddressSymbol.test(address);
	},
	tag: function (tag) {
		return tagValidator.test(tag);
	}
};
exports.Extract = {
	addr: function (path) {
		//slice front '/'
		return path.slice(1).split('/');
	},
	brackets: function (name) {
		var sp = '' + name.replace('{', '');
		if (sp < name) {
			var sps = sp.replace('}', '');
			if (sps < sp) {
				return sps.split(',');
			}
		}
		return [];
	}
}