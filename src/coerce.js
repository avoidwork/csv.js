/**
 * Coerces a String to a Type
 *
 * @method coerce
 * @memberOf utility
 * @param  {String} value String to coerce
 * @return {Mixed}        Primitive version of the String
 */
function coerce ( value ) {
	var tmp;

	if ( value === null || value === undefined ) {
		return undefined;
	}
	else if ( value === "true" ) {
		return true;
	}
	else if ( value === "false" ) {
		return false;
	}
	else if ( value === "null" ) {
		return null;
	}
	else if ( value === "undefined" ) {
		return undefined;
	}
	else if ( value === "" ) {
		return value;
	}
	else if ( !isNaN( tmp = Number( value ) ) ) {
		return tmp;
	}
	else if ( REGEX_JSON.test( value ) ) {
		return parse( value ) || value;
	}
	else {
		return value;
	}
}
