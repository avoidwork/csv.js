/**
 * csv.js
 *
 * @author Jason Mulligan <jason.mulligan@avoidwork.com>
 * @copyright 2013 Jason Mulligan
 * @license BSD-3 <https://raw.github.com/avoidwork/csv.js/master/LICENSE>
 * @link http://csvjs.com
 * @module csv.js
 * @version 0.1.1
 */
( function ( global ) {
"use strict";

var REGEX_IE      = /msie|ie/i,
    REGEX_NL      = /\n$/,
    REGEX_OBJTYPE = /\[object Object\]/,
    REGEX_QUOTE   = /^\s|\"|\n|,|\s$/,
    navigator     = global.navigator,
    ie            = navigator ? REGEX_IE.test( navigator.userAgent ) : false,
    version       = ie ? parseInt( navigator.userAgent.replace( /(.*msie|;.*)/gi, "" ), 10 ) : null;

/**
 * Returns an Object ( NodeList, etc. ) as an Array
 *
 * @method cast
 * @param  {Object}  obj Object to cast
 * @param  {Boolean} key [Optional] Returns key or value, only applies to Objects without a length property
 * @return {Array}       Object as an Array
 */
var cast = function () {
	if ( !ie || version > 8) {
		return function ( obj, key ) {
			key = ( key === true );
			var o = [];

			if ( !isNaN( obj.length ) ) {
				o = Array.prototype.slice.call( obj );
			}
			else {
				key ? o = keys( obj )
				    : iterate( obj, function ( i ) {
				    	o.push( i );
				      });
			}

			return o;
		};
	}
	else {
		return function ( obj, key ) {
			key   = ( key === true );
			var o = [];

			if ( !isNaN( obj.length ) ) {
				try {
					o = Array.prototype.slice.call( obj );
				}
				catch ( e ) {
					iterate( obj, function ( i, idx ) {
						if ( idx !== "length" ) {
							o.push( i );
						}
					});
				}
			}
			else {
				key ? o = keys( obj )
				    : iterate(obj, function ( i ) {
				    	o.push(i);
				      });
			}

			return o;
		};
	}
}();

/**
 * Transforms JSON to CSV
 * 
 * @method csv
 * @param  {String}  arg       Array, Object or JSON String to transform
 * @param  {String}  delimiter [Optional] Character to separate fields
 * @param  {Boolean} header    [Optional] False to not include field names as first row
 * @return {String}            CSV string
 */
var csv = function ( arg, delimiter, header ) {
	delimiter  = delimiter || ",";
	header     = ( header !== false );
	var obj    = decode( arg ) || arg,
	    result = "";

	if ( obj instanceof Array ) {
		if ( obj[0] instanceof Object ) {
			if ( header ) {
				result = ( keys( obj[0] ).join( delimiter ) + "\n" );
			}

			result += obj.map( function ( i ) {
				return csv( i, delimiter, false );
			}).join( "\n" );
		}
		else {
			result += ( cast( obj ).map( function ( i ) {
				return prepare( i, delimiter );
			}).join( delimiter ) + "\n" );
		}
	}
	else {
		if ( header ) {
			result = ( keys( obj ).join( delimiter ) + "\n" );
		}

		result += ( cast( obj ).map( function ( i ) {
			return prepare( i, delimiter );
		}).join( delimiter ) + "\n" );
	}

	return result.replace( REGEX_NL, "" );
};

/**
 * Decodes the argument
 *
 * @method decode
 * @param  {String}  arg String to parse
 * @return {Mixed}       Entity resulting from parsing JSON, or undefined
 */
function decode ( arg ) {
	try {
		return JSON.parse( arg );
	}
	catch ( e ) {
		return undefined;
	}
};

/**
 * Iterates an Object and executes a function against the properties
 *
 * Iteration can be stopped by returning false from fn
 * 
 * @method iterate
 * @param  {Object}   obj Object to iterate
 * @param  {Function} fn  Function to execute against properties
 * @return {Object}       Object
 */
var iterate = function () {
	if ( typeof Object.keys === "function" ) {
		return function ( obj, fn ) {
			if ( typeof fn !== "function" ) {
				throw Error( "Invalid arguments" );
			}

			Object.keys( obj ).forEach( function ( i ) {
				return fn.call( obj, obj[i], i );
			});

			return obj;
		};
	}
	else {
		return function ( obj, fn ) {
			var has = Object.prototype.hasOwnProperty,
			    i, result;

			if ( typeof fn !== "function" ) {
				throw Error( "Invalid arguments" );
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

/**
 * Returns the keys in an "Associative Array"
 *
 * @method keys
 * @param  {Mixed} obj Array or Object to extract keys from
 * @return {Array}     Array of the keys
 */
var keys = function () {
	if ( typeof Object.keys === "function" ) {
		return function ( obj ) {
			return Object.keys( obj );
		};
	}
	else {
		return function ( obj ) {
			var keys = [];

			iterate( obj, function ( v, k ) {
				keys.push( k );
			});

			return keys;
		};
	}
}();

/**
 * Prepares input based on CSV rules
 * 
 * @method param
 * @param  {Mixed}  input     Array, Object or String
 * @param  {String} delimiter [Optional] Character to separate fields
 * @return {String}           CSV formatted String
 */
var prepare = function ( input, delimiter ) {
	var output;

	if ( input instanceof Array ) {
		output = "\"" + input.toString() + "\"";

		if ( REGEX_OBJTYPE.test( output ) ) {
			output = "\"" + csv( input, delimiter ) + "\"";
		}
	}
	else if ( input instanceof Object ) {
		output = "\"" + csv( input, delimiter ) + "\"";
	}
	else if ( REGEX_QUOTE.test( input ) ) {
		output = "\"" + input.replace( /"/g, "\"\"" ) + "\"";
	}
	else {
		output = input;
	}

	return output;
};

// Setting version hint
csv.version = "0.1.1";

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