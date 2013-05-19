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
