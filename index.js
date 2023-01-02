const express = require('express');
const debug = require('debug')('app:index');
require('./startup/logging')();

// create express app
const app = express();

require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/joiValidation')();

// throw new Error('adf')
// start app
const port = process.env.PORT || 3000
console.log(port);
app.listen(port, () => console.log(`Listening at port ${port}...`));
