"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * Simplify encoding & decoding CSV
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2018
 * @license BSD-3-Clause
 * @version 1.0.4
 */
(function (global) {
	"use strict";

	var REGEX_IE = /msie|ie/i,
	    REGEX_NL = /(\n|\r)$/,
	    REGEX_OBJTYPE = /\[object Object\]/,
	    REGEX_JSON = /^[\[\{]/,
	    REGEX_QUOTE = /^\s|\"|\n|,|\s$/,
	    REGEX_WRAPPED = /^".*"$/,
	    navigator = global.navigator,
	    ie = navigator ? REGEX_IE.test(navigator.userAgent) : false,
	    version = ie ? parseInt(navigator.userAgent.replace(/(.*msie|;.*)/gi, ""), 10) : null;

	var cast = function cast(obj) {
		var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
		var ref = arguments[2];

		var result = void 0;

		if (Array.isArray(obj)) {
			result = Array.from(obj);
		} else if (key) {
			result = keys(obj, ref);
		} else {
			result = [];
			iterate(obj, function (i) {
				return result.push(i);
			}, ref);
		}

		return result;
	};

	function coerce(value) {
		var result = void 0,
		    tmp = void 0;

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

	function decode(arg) {
		var delimiter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ",";

		var regex = new RegExp(delimiter + "(?=(?:[^\"]|\"(?:[^\"])[^\"]*\")*$)"),
		    rows = trim(arg).split("\n"),
		    keys = rows.shift().split(delimiter),
		    result = [],
		    nth = rows.length,
		    x = keys.length;

		var i = -1;

		while (++i < nth) {
			var obj = {},
			    row = rows[i].split(regex),
			    n = -1;

			while (++n < x) {
				obj[keys[n]] = coerce(row[n] || "");
			}

			result.push(obj);
		}

		return result;
	}

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

	var iterate = function iterate(obj, fn, keyRef) {
		if (typeof fn !== "function") {
			throw new Error("Invalid arguments");
		}

		(keyRef || Object.keys(obj)).forEach(function (i) {
			return fn.call(obj, obj[i], i);
		});

		return obj;
	};

	var keys = function keys(obj, ref) {
		return ref !== void 0 ? ref.map(function (i) {
			return obj[i];
		}) : Object.keys(obj);
	};

	function parse(arg) {
		try {
			return JSON.parse(arg);
		} catch (e) {
			return arg;
		}
	}

	function prepare(input, delimiter) {
		var output = void 0;

		if (input instanceof Array) {
			output = "\"" + input.toString() + "\"";

			if (REGEX_OBJTYPE.test(output)) {
				output = "\"" + encode(input, delimiter) + "\"";
			}
		} else if (input instanceof Object) {
			output = "\"" + encode(input, delimiter) + "\"";
		} else {
			output = input;
		}

		return output;
	}

	var trim = function trim(arg) {
		return arg.replace(/^(\s+|\t+)|(\s+|\t+|\n+)$/g, "");
	};

	var iface = {
		decode: decode,
		encode: encode,
		version: "1.0.4"
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
