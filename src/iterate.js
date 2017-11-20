	/**
	 * Iterates an Object and executes a function against the properties,
	 * & can be halted by returning `false` from `fn`
	 *
	 * @method iterate
	 * @param  {Object}   obj Object to iterate
	 * @param  {Function} fn  Function to execute against properties
	 * @return {Object}       Object
	 */
	const iterate = function () {
		const keys = Object.keys || function (obj, fn) {
			const has = Object.prototype.hasOwnProperty;
			let i, result;

			if (typeof fn !== "function") {
				throw new Error("Invalid arguments");
			}

			for (i in obj) {
				if (has.call(obj, i)) {
					result = fn.call(obj, obj[i], i);

					if (result === false) {
						break;
					}
				} else {
					break;
				}
			}

			return obj;
		};

		return function (obj, fn) {
			if (typeof fn !== "function") {
				throw new Error("Invalid arguments");
			}

			keys(obj).forEach(i => fn.call(obj, obj[i], i));

			return obj;
		};
	}();
