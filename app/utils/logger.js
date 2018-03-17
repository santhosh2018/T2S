'use strict';
if (process.env.NODE_ENV !== 'testing')    {
  module.exports = console;
}
else {
  const sinon = require('sinon');
  module.exports = {
    log: sinon.stub(),
    info: sinon.stub(),
    warn: sinon.stub(),
    error: sinon.stub(),
    debug: sinon.stub(),
  };
}
