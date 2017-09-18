(function (global) {
	"use strict";

	const REGEX_IE = /msie|ie/i,
		REGEX_NL = /(\n|\r)$/,
		REGEX_OBJTYPE = /\[object Object\]/,
		REGEX_JSON = /^[\[\{]/,
		REGEX_QUOTE = /^\s|\"|\n|,|\s$/,
		navigator = global.navigator,
		ie = navigator ? REGEX_IE.test(navigator.userAgent) : false,
		version = ie ? parseInt(navigator.userAgent.replace(/(.*msie|;.*)/gi, ""), 10) : null;
