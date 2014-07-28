# csv.js
Simplify encoding & decoding CSV. Easy exporting from an API, or reformatting on a Client!

[![build status](https://secure.travis-ci.org/avoidwork/csv.js.svg)](http://travis-ci.org/avoidwork/csv.js)


## Example
```javascript
var csv = require( "csv.js" );
var encoded = csv.encode( [{prop: "value"}, {prop: "value2"}] );

console.log( encoded );

//
prop
value
value2
```

## How can I load csv.js?
csv.js supports AMD loaders (require.js, curl.js, etc.), CommonJS, node.js & npm (npm install csv.js), or using a script tag.

## License
csv.js is licensed under BSD-3 https://raw.github.com/avoidwork/csv.js/master/LICENSE

## Copyright
Copyright (c) 2014, Jason Mulligan <jason.mulligan@avoidwork.com>
