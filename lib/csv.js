"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Simplify encoding & decoding CSV
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2017
 * @license BSD-3-Clause
 * @version 1.0.3
 */
(function (global) {
	"use strict";

	var REGEX_IE = /msie|ie/i,
	    REGEX_NL = /(\n|\r)$/,
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
	var cast = function () {
		if (!ie || version > 8) {
			return function (obj) {
				var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
				var ref = arguments[2];

				var o = [];

				if (!isNaN(obj.length)) {
					o = Array.prototype.slice.call(obj);
				} else {
					key ? o = keys(obj, ref) : iterate(obj, function (i) {
						return o.push(i);
					}, ref);
				}

				return o;
			};
		} else {
			return function (obj) {
				var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
				var ref = arguments[2];

				var o = [];

				if (!isNaN(obj.length)) {
					try {
						o = Array.prototype.slice.call(obj);
					} catch (e) {
						iterate(obj, function (i, idx) {
							if (idx !== "length") {
								o.push(i);
							}
						});
					}
				} else {
					key ? o = keys(obj, ref) : iterate(obj, function (i) {
						return o.push(i);
					}, ref);
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
	function coerce(value) {
		var tmp = void 0;

		if (value === null || value === undefined) {
			return undefined;
		} else if (value === "true") {
			return true;
		} else if (value === "false") {
			return false;
		} else if (value === "null") {
			return null;
		} else if (value === "undefined") {
			return undefined;
		} else if (value === "") {
			return value;
		} else if (!isNaN(tmp = Number(value))) {
			return tmp;
		} else if (REGEX_JSON.test(value)) {
			return parse(value);
		} else {
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
	function decode(arg) {
		var delimiter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ",";

		var regex = new RegExp(delimiter + "(?=(?:[^\"]|\"(?:[^\"])[^\"]*\")*$)"),
		    rows = trim(arg).split("\n"),
		    keys = rows.shift().split(delimiter),
		    result = [],
		    nth = rows.length,
		    x = keys.length;

		var i = -1,
		    n = void 0,
		    obj = void 0,
		    row = void 0;

		while (++i < nth) {
			obj = {};
			row = rows[i].split(regex);

			n = -1;
			while (++n < x) {
				obj[keys[n]] = coerce((row[n] || "").replace(/^"|"$/g, ""));
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
	function encode(arg) {
		var delimiter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ",";
		var header = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
		var keyRef = arguments[3];

		var obj = parse(arg);
		var result = "",
		    ref = void 0;

		if (obj instanceof Array) {
			if (obj[0] instanceof Object) {
				if (header) {
					ref = keys(obj[0]);
					result = ref.join(delimiter) + "\n";
				}

				result += obj.map(function (i) {
					return encode(i, delimiter, false, ref);
				}).join("\n");
			} else {
				result += prepare(obj, delimiter) + "\n";
			}
		} else {
			if (header) {
				ref = keys(obj, keyRef);
				result = ref.join(delimiter) + "\n";
			} else {
				ref = keyRef;
			}

			result += cast(obj, false, ref).map(function (i) {
				return prepare(i, delimiter);
			}).join(delimiter) + "\n";
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
	var iterate = function () {
		if (typeof Object.keys == "function") {
			return function (obj, fn, keyRef) {
				if (typeof fn != "function") {
					throw new Error("Invalid arguments");
				}

				(keyRef || Object.keys(obj)).forEach(function (i) {
					return fn.call(obj, obj[i], i);
				});

				return obj;
			};
		} else {
			return function (obj, fn, keyRef) {
				var has = Object.prototype.hasOwnProperty;

				var i = void 0,
				    result = void 0;

				if (typeof fn != "function") {
					throw new Error("Invalid arguments");
				}

				if (keyRef !== void 0) {
					keyRef.forEach(function (i) {
						return fn.call(obj, obj[i], i);
					});
				} else {
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
	var keys = function () {
		if (typeof Object.keys == "function") {
			return function (obj, ref) {
				var result = void 0;

				if (ref !== void 0) {
					result = ref.map(function (i) {
						return obj[i];
					});
				} else {
					result = Object.keys(obj);
				}

				return result;
			};
		} else {
			return function (obj, ref) {
				var result = void 0;

				if (ref !== void 0) {
					result = ref.map(function (i) {
						return obj[i];
					});
				} else {
					result = [];
					iterate(obj, function (v, k) {
						return result.push(k);
					});
				}

				return result;
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
		} catch (e) {
			return arg;
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
		var output = void 0;

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
	var iface = {
		decode: decode,
		encode: encode,
		version: "1.0.3"
	};

	// CommonJS, AMD, script tag
	if (typeof exports != "undefined") {
		module.exports = iface;
	} else if (typeof define == "function" && _typeof(define.amd) !== void 0) {
		define(function () {
			return iface;
		});
	} else {
		global.csv = iface;
	}
})(typeof window !== "undefined" ? window : global);
