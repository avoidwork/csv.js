/**
 * Converts CSV to an Array of Objects
 *
 * @method decode
 * @param  {String} arg       CSV string
 * @param  {String} delimiter [Optional] Delimiter to split columns on, default is ","
 * @return {Array}            Array of Objects
 */
function decode ( arg, delimiter ) {
	delimiter  = delimiter || ",";
	var regex  = new RegExp( delimiter + "(?=(?:[^\"]|\"(?:[^\"])[^\"]*\")*$)" ),
	    rows   = trim( arg ).split( "\n" ),
	    keys   = rows.shift().split( delimiter ),
	    result = [],
	    nth    = rows.length,
	    x      = keys.length,
	    i      = -1,
	    n, obj, row;

	while ( ++i < nth ) {
		obj = {};
		row = rows[i].split( regex );

		n = -1;
		while ( ++n < x ) {
			obj[keys[n]] = coerce( ( row[n] || "" ).replace( /^"|"$/g, "" ) );
		}

		result.push( obj );
	}

	return result;
}
