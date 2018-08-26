	const iterate = (obj, fn, keyRef) => {
		if (typeof fn !== "function") {
			throw new Error("Invalid arguments");
		}

		(keyRef || Object.keys(obj)).forEach(i => fn.call(obj, obj[i], i));

		return obj;
	};
