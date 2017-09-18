	/**
	 * Returns the keys in an "Associative Array"
	 *
	 * @method keys
	 * @param  {Mixed} obj Array or Object to extract keys from
	 * @return {Array}     Array of the keys
	 */
	const keys = function () {
		if (typeof Object.keys == "function") {
			return (obj, ref) => {
				let result;

				if (ref !== void 0) {
					result = ref.map(i => obj[i]);
				} else {
					result = Object.keys(obj);
				}

				return result;
			}
		} else {
			return (obj, ref) => {
				let result;

				if (ref !== void 0) {
					result = ref.map(i => obj[i]);
				} else {
					result = [];
					iterate(obj, (v, k) => result.push(k));
				}

				return result;
			};
		}
	}();
