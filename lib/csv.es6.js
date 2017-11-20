/**
 * Simplify encoding & decoding CSV
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2017
 * @license BSD-3-Clause
 * @version 1.0.4
 */
(function (global) {
	"use strict";

	const REGEX_IE = /msie|ie/i,
		REGEX_NL = /\n$/,
		REGEX_OBJTYPE = /\[object Object\]/,
		REGEX_JSON = /^[\[\{]/,
		REGEX_QUOTE = /^\s|\"|\n|,|\s$/,
		navigator = global.navigator,
		ie = navigator ? REGEX_IE.test(navigator.userAgent) : false,
		version = ie ? parseInt(navigator.userAgent.replace(/(.*msie|;.*)/gi, ""), 10) : null;

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
				let o = [];

				if (!isNaN(obj.length)) {
					o = Array.prototype.slice.call(obj);
				} else {
					key ? o = keys(obj) : iterate(obj, i => o.push(i));
				}

				return o;
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

	/**
	 * Coerces a String to a Type
	 *
	 * @method coerce
	 * @memberOf utility
	 * @param  {String} value String to coerce
	 * @return {Mixed}        Primitive version of the String
	 */
	function coerce (value) {
		var tmp;

		if (value === null || value === undefined) {
			return undefined;
		}
		else if (value === "true") {
			return true;
		}
		else if (value === "false") {
			return false;
		}
		else if (value === "null") {
			return null;
		}
		else if (value === "undefined") {
			return undefined;
		}
		else if (value === "") {
			return value;
		}
		else if (!isNaN(tmp = Number(value))) {
			return tmp;
		}
		else if (REGEX_JSON.test(value)) {
			return parse(value) || value;
		}
		else {
			return value;
		}
	}

	/**
	 * Converts CSV to an Array of Objects
	 *
	 * @method decode
	 * @param  {String} arg       CSV string
	 * @param  {String} delimiter [Optional] Delimiter to split columns on, default is ","
	 * @return {Array}            Array of Objects
	 */
	function decode(arg, delimiter = ",") {
		const regex = new RegExp(delimiter + "(?=(?:[^\"]|\"(?:[^\"])[^\"]*\")*$)"),
			rows = trim(arg).split("\n"),
			keys = rows.shift().split(delimiter),
			result = [],
			nth = rows.length,
			x = keys.length;

		let i = -1,
			n, obj, row;

		while (++i < nth) {
			obj = {};
			row = rows[i].split(regex);

			n = -1;
			while (++n < x) {
				obj[keys[n]] = coerce(( row[n] || "" ).replace(/^"|"$/g, ""));
			}

			result.push(obj);
		}

		return result;
	}

	/**
	 * Encodes `arg` as CSV
	 *
	 * @method encode
	 * @param  {String}  arg       Array, Object or JSON String to transform
	 * @param  {String}  delimiter [Optional] Character to separate fields
	 * @param  {Boolean} header    [Optional] False to not include field names as first row
	 * @return {String}            CSV string
	 */
	function encode(arg, delimiter = ",", header = true) {
		const obj = parse(arg) || arg;
		let result = "";

		if (obj instanceof Array) {
			if (obj[0] instanceof Object) {
				if (header) {
					result = keys(obj[0]).join(delimiter) + "\n";
				}

				result += obj.map(i =>encode(i, delimiter, false)).join("\n");
			} else {
				result += (prepare(obj, delimiter) + "\n");
			}
		} else {
			if (header) {
				result = keys(obj).join(delimiter) + "\n";
			}

			result += cast(obj).map(i => prepare(i, delimiter)).join(delimiter) + "\n";
		}

		return result.replace(REGEX_NL, "");
	}

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
			return function (obj, fn) {
				if (typeof fn != "function") {
					throw new Error("Invalid arguments");
				}

				Object.keys(obj).forEach(function (i) {
					return fn.call(obj, obj[i], i);
				});

				return obj;
			};
		}
		else {
			return function (obj, fn) {
				var has = Object.prototype.hasOwnProperty,
					i, result;

				if (typeof fn != "function") {
					throw new Error("Invalid arguments");
				}

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

				return obj;
			};
		}
	}();

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

	/**
	 * Parses the argument
	 *
	 * @method parse
	 * @param  {String} arg String to parse
	 * @return {Mixed}      Resulting from parsing JSON, or undefined
	 */
	function parse(arg) {
		try {
			return JSON.parse(arg);
		}
		catch (e) {
			return undefined;
		}
	}

	/**
	 * Prepares input based on CSV rules
	 *
	 * @method param
	 * @param  {Mixed}  input     Array, Object or String
	 * @param  {String} delimiter [Optional] Character to separate fields
	 * @return {String}           CSV formatted String
	 */
	function prepare(input, delimiter) {
		let output;

		if (input instanceof Array) {
			output = "\"" + input.toString() + "\"";

			if (REGEX_OBJTYPE.test(output)) {
				output = "\"" + encode(input, delimiter) + "\"";
			}
		} else if (input instanceof Object) {
			output = "\"" + encode(input, delimiter) + "\"";
		} else if (REGEX_QUOTE.test(input)) {
			output = "\"" + input.replace(/"/g, "\"\"") + "\"";
		} else {
			output = input;
		}

		return output;
	}

	/**
	 * Trims a string
	 *
	 * @method  trim
	 * @param  {String} arg String to trim
	 * @return {String}     Trimmed String
	 */
	function trim(arg) {
		return arg.replace(/^(\s+|\t+)|(\s+|\t+|\n+)$/g, "");
	}

	/**
	 * Interface
	 *
	 * @type {Object}
	 */
	const iface = {
		decode: decode,
		encode: encode,
		version: "1.0.4"
	};

	// CommonJS, AMD, script tag
	if (typeof exports != "undefined") {
		module.exports = iface;
	} else if (typeof define == "function" && typeof define.amd !== void 0) {
		define(() => iface);
	} else {
		global.csv = iface;
	}
}(typeof window !== "undefined" ? window : global));