( function ( global ) {
"use strict";

var REGEX_QUOTE   = /^\s|\"|\n|,|\s$/,
    REGEX_OBJTYPE = /\[object Object\]/,
    REGEX_IE      = /msie|ie/i,
    navigator     = global.navigator,
    ie            = navigator ? REGEX_IE.test( navigator.userAgent ) : false,
    version       = ie ? parseInt( navigator.userAgent.replace( /(.*msie|;.*)/gi, "" ), 10 ) : null;
