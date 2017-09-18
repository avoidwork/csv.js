	/**
	 * Encodes `arg` as CSV
	 *
	 * @method encode
	 * @param  {String}  arg       Array, Object or JSON String to transform
	 * @param  {String}  delimiter [Optional] Character to separate fields
	 * @param  {Boolean} header    [Optional] False to not include field names as first row
	 * @return {String}            CSV string
	 */
	function encode(arg, delimiter = ",", header = true, keyRef) {
		const obj = parse(arg);
		let result = "",
			ref;

		if (obj instanceof Array) {
			if (obj[0] instanceof Object) {
				if (header) {
					ref = keys(obj[0]);
					result = ref.join(delimiter) + "\n";
				}

				result += obj.map(i =>encode(i, delimiter, false, ref)).join("\n");
			} else {
				result += prepare(obj, delimiter) + "\n";
			}
		} else {
			if (header) {
				ref = keys(obj, keyRef);
				result = ref.join(delimiter) + "\n";
			} else {
				ref = keyRef;
			}

			result += cast(obj, false, ref).map(i => prepare(i, delimiter)).join(delimiter) + "\n";
		}

		return result.replace(REGEX_NL, "");
	}
