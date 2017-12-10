	function parse (arg) {
		try {
			return JSON.parse(arg);
		} catch (e) {
			return arg;
		}
	}
