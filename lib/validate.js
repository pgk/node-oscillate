var InvalidAddressSymbol = /\s|\{|\}|\#|\*|\,|\?|\/|\[|\]/;

exports.Validate = {
	addressSymbol: function (address) {
		return !InvalidAddressSymbol.test(address);
	}
};