'use strict';

global.approot = require('app-root-path');
global.schemaName = 'testing';
process.env.NODE_ENV = process.env.NODE_ENV === undefined ? 'testing' : process.env.NODE_ENV;
