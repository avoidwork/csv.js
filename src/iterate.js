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
		if (typeof Object.keys == "function") {
			return function (obj, fn, keyRef) {
				if (typeof fn != "function") {
					throw new Error("Invalid arguments");
				}

				(keyRef || Object.keys(obj)).forEach(i =>fn.call(obj, obj[i], i));

				return obj;
			};
		}
		else {
			return function (obj, fn, keyRef) {
				var has = Object.prototype.hasOwnProperty,
					i, result;

				if (typeof fn != "function") {
					throw new Error("Invalid arguments");
				}

				if (keyRef !== void 0) {
					keyRef.forEach(i => fn.call(obj, obj[i], i));
				} else {
					for (i in obj) {
						if (has.call(obj, i)) {
							result = fn.call(obj, obj[i], i);

							if (result === false) {
								break;
							}
						}
						else {
							break;
						}
					}
				}

				return obj;
			};
		}
	}();
