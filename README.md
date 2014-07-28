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

## API
### encode( arg[, delimiter, header] )
Encodes `arg` as CSV. The optional `delimiter` allows you change the default `comma`. The optional `header` allows you to disable the first row of column names by passing `false`.

### decode( arg[, delimiter] )
Decodes `arg` to an `Array` of `Objects`. The optional `delimiter` allows you to specify the delimiter if it is not a `comma`.

## How can I load csv.js?
csv.js supports AMD loaders (require.js, curl.js, etc.), CommonJS, node.js & npm (npm install csv.js), or using a script tag.

## License
csv.js is licensed under BSD-3 https://raw.github.com/avoidwork/csv.js/master/LICENSE

## Copyright
Copyright (c) 2014, Jason Mulligan <jason.mulligan@avoidwork.com>
