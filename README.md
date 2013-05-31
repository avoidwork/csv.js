[![build status](https://secure.travis-ci.org/avoidwork/csv.js.png)](http://travis-ci.org/avoidwork/csv.js)
# csv.js

Encodes Arrays, Objects or JSON as CSV. Easy exporting from an API, or reformatting on a Client!

## Example

```javascript
var csv = require('csv.js');

csv("[{\"prop\":\"value\"},{\"prop\":\"value2\"}]"); // "prop\nvalue\nvalue2"
```

## How can I load csv.js?

csv.js supports AMD loaders (require.js, curl.js, etc.), node.js & npm (npm install csv.js), or using a script tag.

## Information

#### License

csv.js is licensed under BSD-3 https://raw.github.com/avoidwork/csv.js/master/LICENSE

#### Copyright

Copyright (c) 2013, Jason Mulligan <jason.mulligan@avoidwork.com>
