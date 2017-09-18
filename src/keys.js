	/**
	 * Returns the keys in an "Associative Array"
	 *
	 * @method keys
	 * @param  {Mixed} obj Array or Object to extract keys from
	 * @return {Array}     Array of the keys
	 */
	const keys = function () {
		if (typeof Object.keys == "function") {
			return obj => Object.keys(obj);
		} else {
			return obj => {
				const keys = [];

				iterate(obj, (v, k) => keys.push(k));

				return keys;
			};
		}
	}();
