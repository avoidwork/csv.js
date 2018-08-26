	// CommonJS, AMD, script tag
	if (typeof exports !== "undefined") {
		module.exports = iface;
	} else if (typeof define === "function" && typeof define.amd !== void 0) {
		define(() => iface);
	} else {
		global.csv = iface;
	}
}(typeof window !== "undefined" ? window : global));
