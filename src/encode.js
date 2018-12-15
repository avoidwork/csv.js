	function encode (arg, delimiter = ",", header = true, keyRef) {
		const obj = parse(arg);
		let result = "",
			ref;

		if (Array.isArray(obj)) {
			if (obj.length > 0) {
				if (obj[0] instanceof Object) {
					if (header) {
						ref = keys(obj[0]);
						result = ref.join(delimiter) + "\n";
					}

					result += obj.map(i => encode(i, delimiter, false, ref)).join("\n");
				} else {
					result += prepare(obj, delimiter) + "\n";
				}
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
