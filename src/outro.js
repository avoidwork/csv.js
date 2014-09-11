// CommonJS, AMD, script tag
if ( typeof exports != "undefined" ) {
	module.exports = iface;
}
else if ( typeof define == "function" ) {
	define( function () {
		return iface;
	} );
}
else {
	global.csv = iface;
}
} )( this );
