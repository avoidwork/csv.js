(function (global) {
	"use strict";

	const REGEX_NL = /(\n|\r)$/,
		REGEX_OBJTYPE = /\[object Object\]/,
		REGEX_JSON = /^[\[\{]/;
