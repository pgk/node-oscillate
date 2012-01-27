var InvalidAddressSymbol = /\s|\{|\}|\#|\*|\,|\?|\/|\[|\]/;
var addressExtractor = /\/*[a-z]/;

exports.Validate = {
	addressSymbol: function (address) {
		return !InvalidAddressSymbol.test(address);
	}
};

exports.Extract = {
	address: function (path) {
		return path.slice(1).split('/');
	}
}