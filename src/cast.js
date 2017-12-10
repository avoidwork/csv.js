	const cast = (obj, key = false, ref) => {
		let result;

		if (Array.isArray(obj)) {
			result = Array.from(obj);
		} else if (key) {
			result = keys(obj, ref);
		} else {
			result = [];
			iterate(obj, i => result.push(i), ref);
		}

		return result;
	};
