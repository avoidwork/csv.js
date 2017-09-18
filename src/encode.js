	/**
	 * Encodes `arg` as CSV
	 *
	 * @method encode
	 * @param  {String}  arg       Array, Object or JSON String to transform
	 * @param  {String}  delimiter [Optional] Character to separate fields
	 * @param  {Boolean} header    [Optional] False to not include field names as first row
	 * @return {String}            CSV string
	 */
	function encode(arg, delimiter = ",", header = true) {
		const obj = parse(arg) || arg;
		let result = "";

		if (obj instanceof Array) {
			if (obj[0] instanceof Object) {
				if (header) {
					result = keys(obj[0]).join(delimiter) + "\n";
				}

				result += obj.map(i =>encode(i, delimiter, false)).join("\n");
			} else {
				result += (prepare(obj, delimiter) + "\n");
			}
		} else {
			if (header) {
				result = keys(obj).join(delimiter) + "\n";
			}

			result += cast(obj).map(i => prepare(i, delimiter)).join(delimiter) + "\n";
		}

		return result.replace(REGEX_NL, "");
	}
