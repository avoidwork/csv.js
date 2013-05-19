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
