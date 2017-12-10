	function coerce (value) {
		let result, tmp;

		if (value === null || value === undefined) {
			result = undefined;
		} else if (value === "true") {
			result = true;
		} else if (value === "false") {
			result = false;
		} else if (value === "null") {
			result = null;
		} else if (value === "undefined") {
			result = undefined;
		} else if (value === "") {
			result = value;
		} else if (!isNaN(tmp = Number(value))) {
			result = tmp;
		} else if (REGEX_JSON.test(value)) {
			result = parse(value);
		} else {
			result = value;
		}

		return result;
	}
