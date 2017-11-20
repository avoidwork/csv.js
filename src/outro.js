	const output = {
		decode: decode,
		encode: encode,
		version: "{{VERSION}}"
	};

	// CommonJS, AMD, script tag
	if (typeof module !== "undefined") {
		module.exports = output;
	} else if (typeof define === "function" && typeof define.amd !== void 0) {
		define(() => output);
	} else {
		global.csv = output;
	}
}(typeof window !== "undefined" ? window : global));
