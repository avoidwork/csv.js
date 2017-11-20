	/**
	 * Returns an Object ( NodeList, etc. ) as an Array
	 *
	 * @method cast
	 * @param  {Object}  obj Object to cast
	 * @param  {Boolean} key [Optional] Returns key or value, only applies to Objects without a length property
	 * @return {Array}       Object as an Array
	 */
	const cast = function () {
		if (!ie || version > 8) {
			return (obj, key = false) => {
				return !isNaN(obj.length) ? Array.prototype.slice.call(obj) : key ? keys(obj) : keys(obj).map(i => obj[i]);
			};
		} else {
			return (obj, key = false) => {
				let o = [];

				if (!isNaN(obj.length)) {
					try {
						o = Array.prototype.slice.call(obj);
					} catch (e) {
						iterate(obj, (i, idx) => {
							if (idx !== "length") {
								o.push(i);
							}
						});
					}
				} else {
					key ? o = keys(obj) : iterate(obj, i => o.push(i));
				}

				return o;
			};
		}
	}();
