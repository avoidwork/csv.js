/**
 * Parses the argument
 *
 * @method parse
 * @param  {String} arg String to parse
 * @return {Mixed}      Resulting from parsing JSON, or undefined
 */
function parse ( arg ) {
	try {
		return JSON.parse( arg );
	}
	catch ( e ) {
		return undefined;
	}
}
