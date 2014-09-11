/**
 * Trims a string
 *
 * @method  trim
 * @param  {String} arg String to trim
 * @return {String}     Trimmed String
 */
function trim ( arg ) {
	return arg.replace( /^(\s+|\t+)|(\s+|\t+|\n+)$/g, "" );
}
