	function prepare (input, delimiter) {
		let output;

		if (Array.isArray(input)) {
			if (input.length === 0) {
				output = "";
			} else {
				output = input.toString();

				if (REGEX_OBJTYPE.test(output)) {
					output = `"${encode(input, delimiter)}"`; // eslint-disable-line no-use-before-define
				} else if (output.includes(delimiter)) {
					output = `"${output}"`;
				}
			}
		} else if (input instanceof Object) {
			output = `"${JSON.stringify(input)}"`; // eslint-disable-line no-use-before-define
		} else if (typeof input === "string") {
			output = input.indexOf(delimiter) > -1 && input.charAt(0) !== "\"" ? `"${input}"` : input;
		} else {
			output = input;
		}

		return output;
	}
