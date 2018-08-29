/**
 * Simplify encoding & decoding CSV
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2018
 * @license BSD-3-Clause
 * @version 1.0.6
 */
(function (global) {
	"use strict";

	const REGEX_NL = /(\n|\r)$/,
		REGEX_OBJTYPE = /\[object Object\]/,
		REGEX_JSON = /^[\[\{]/;

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

	function coerce (value) {
		let result, tmp;

		if (value === null || value === undefined) {
			result = undefined;
		} else if (value === "true") {
			result = true;
		} else if (value === "false") {
			result = false;
		} else if (value === "null") {
			result = null;
		} else if (value === "undefined") {
			result = undefined;
		} else if (value === "") {
			result = value;
		} else if (!isNaN(tmp = Number(value))) {
			result = tmp;
		} else if (REGEX_JSON.test(value)) {
			result = parse(value);
		} else {
			result = value;
		}

		return result;
	}

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

	function encode (arg, delimiter = ",", header = true, keyRef) {
		const obj = parse(arg);
		let result = "",
			ref;

		if (obj instanceof Array) {
			if (obj.length > 0) {
				if (obj[0] instanceof Object) {
					if (header) {
						ref = keys(obj[0]);
						result = ref.join(delimiter) + "\n";
					}

					result += obj.map(i => encode(i, delimiter, false, ref)).join("\n");
				} else {
					result += prepare(obj, delimiter) + "\n";
				}
			}
		} else {
			if (header) {
				ref = keys(obj, keyRef);
				result = ref.join(delimiter) + "\n";
			} else {
				ref = keyRef;
			}

			result += cast(obj, false, ref).map(i => prepare(i, delimiter)).join(delimiter) + "\n";
		}

		return result.replace(REGEX_NL, "");
	}

	const iterate = (obj, fn, keyRef) => {
		if (typeof fn !== "function") {
			throw new Error("Invalid arguments");
		}

		(keyRef || Object.keys(obj)).forEach(i => fn.call(obj, obj[i], i));

		return obj;
	};

	const keys = (obj, ref) => ref !== void 0 ? ref.map(i => obj[i]) : Object.keys(obj);

	function parse (arg) {
		try {
			return JSON.parse(arg);
		} catch (e) {
			return arg;
		}
	}

	function prepare(input, delimiter) {
		let output;

		if (input instanceof Array) {
			if (input.length === 0) {
				output = "";
			} else {
				output = input.toString();

				if (REGEX_OBJTYPE.test(output)) {
					output = `"${encode(input, delimiter)}"`;
				} else if (output.includes(delimiter)) {
					output = `"${output}"`;
				}
			}
		} else if (input instanceof Object) {
			output = `"${encode(input, delimiter)}"`;
		} else if (typeof input === "string") {
			output = input.indexOf(delimiter) > -1 && input.charAt(0) !== "\"" ? `"${input}"` : input;
		} else {
			output = input;
		}

		return output;
	}

	const trim = arg => arg.trim();

	const iface = {
		decode: decode,
		encode: encode,
		version: "1.0.6"
	};

	// CommonJS, AMD, script tag
	if (typeof exports !== "undefined") {
		module.exports = iface;
	} else if (typeof define === "function" && typeof define.amd !== void 0) {
		define(() => iface);
	} else {
		global.csv = iface;
	}
}(typeof window !== "undefined" ? window : global));
