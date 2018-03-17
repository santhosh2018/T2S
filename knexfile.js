'use strict';


const config = require('config');
module.exports = {
  development: config.get('rdbms'),
  testing: config.get('rdbms'),
  production: config.get('rdbms'),
};
