// Setting version hint
csv.version = "{{VERSION}}";

// CommonJS, AMD, script tag
if ( typeof exports !== "undefined" ) {
	module.exports = csv;
}
else if ( typeof define === "function" ) {
	define( function () {
		return csv;
	});
}
else {
	global.csv = csv;
}
})( this );