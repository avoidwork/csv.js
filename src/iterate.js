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
	if ( typeof Object.keys == "function" ) {
		return function ( obj, fn ) {
			if ( typeof fn != "function" ) {
				throw new Error( "Invalid arguments" );
			}

			Object.keys( obj ).forEach( function ( i ) {
				return fn.call( obj, obj[i], i );
			} );

			return obj;
		};
	}
	else {
		return function ( obj, fn ) {
			var has = Object.prototype.hasOwnProperty,
			    i, result;

			if ( typeof fn != "function" ) {
				throw new Error( "Invalid arguments" );
			}

			for ( i in obj ) {
				if ( has.call( obj, i ) ) {
					result = fn.call( obj, obj[i], i );

					if ( result === false ) {
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
