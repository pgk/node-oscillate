var InvalidAddressSymbol = /\s|\{|\}|\#|\*|\,|\?|\/|\[|\]/;
var addressExtractor = /\+\/s/;
var tagValidator = /\,+[ifsbhtdScrmTFNI]/;

exports.Validate = {
	addressSymbol: function (address) {
		return !InvalidAddressSymbol.test(address);
	},
	tag: function (tag) {
		return tagValidator.test(tag);
	}
};

exports.Extract = {
	address: function (path) {
		//slice front '/'
		return path.slice(1).split('/');
	}
}