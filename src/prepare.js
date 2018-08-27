	function prepare(input, delimiter) {
		let output;

		if (input instanceof Array) {
			if (input.length === 0) {
				output = "";
			} else {
				output = `"${input.toString()}"`;

				if (REGEX_OBJTYPE.test(output)) {
					output = `"${encode(input, delimiter)}"`;
				}
			}
		} else if (input instanceof Object) {
			output = `"${encode(input, delimiter)}"`;
		} else if (typeof input === "string") {
			output = input.indexOf(delimiter) > -1 && input.charAt(0) !== "\"" ? `"${input}"` : input;
		} else {
			output = input;
		}

		return output;
	}
