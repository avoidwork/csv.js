/**
 * Returns the keys in an "Associative Array"
 *
 * @method keys
 * @param  {Mixed} obj Array or Object to extract keys from
 * @return {Array}     Array of the keys
 */
var keys = function () {
	if ( typeof Object.keys == "function" ) {
		return function ( obj ) {
			return Object.keys( obj );
		};
	}
	else {
		return function ( obj ) {
			var keys = [];

			iterate( obj, function ( v, k ) {
				keys.push( k );
			} );

			return keys;
		};
	}
}();
