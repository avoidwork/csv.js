	function decode (arg, delimiter = ",") {
		const regex = new RegExp(delimiter + "(?=(?:[^\"]|\"(?:[^\"])[^\"]*\")*$)"),
			rows = trim(arg).split("\n"),
			keys = rows.shift().split(delimiter),
			result = [],
			nth = rows.length,
			x = keys.length;

		let i = -1;

		while (++i < nth) {
			let obj = {},
				row = rows[i].split(regex),
				n = -1;

			while (++n < x) {
				obj[keys[n]] = coerce(row[n] || "");
			}

			result.push(obj);
		}

		return result;
	}
