/**
 * Prepares input based on CSV rules
 *
 * @method param
 * @param  {Mixed}  input     Array, Object or String
 * @param  {String} delimiter [Optional] Character to separate fields
 * @return {String}           CSV formatted String
 */
function prepare ( input, delimiter ) {
	var output;

	if ( input instanceof Array ) {
		output = "\"" + input.toString() + "\"";

		if ( REGEX_OBJTYPE.test( output ) ) {
			output = "\"" + encode( input, delimiter ) + "\"";
		}
	}
	else if ( input instanceof Object ) {
		output = "\"" + encode( input, delimiter ) + "\"";
	}
	else if ( REGEX_QUOTE.test( input ) ) {
		output = "\"" + input.replace( /"/g, "\"\"" ) + "\"";
	}
	else {
		output = input;
	}

	return output;
}
