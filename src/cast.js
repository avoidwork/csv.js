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
			return (obj, key = false, ref) => {
				let o = [];

				if (!isNaN(obj.length)) {
					o = Array.prototype.slice.call(obj);
				} else {
					key ? o = keys(obj, ref) : iterate(obj, i => o.push(i), ref);
				}

				return o;
			};
		} else {
			return (obj, key = false, ref) => {
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
					key ? o = keys(obj, ref) : iterate(obj, i => o.push(i), ref);
				}

				return o;
			};
		}
	}();
