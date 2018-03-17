'use strict';

/* global approot */
const logger = require(approot + '/app/utils/logger');
const url = require('url');
const config = require('config');
const moment = require('moment');

function canonicalCaseForDb(str) {
  switch (config.get('rdbms').client) {
    case 'pg':
      return str.toLowerCase();
    case 'oracledb':
      return str.toUpperCase();
  }
}
const allErrorCodes = {
    '42P01': 'Schema not found.', /* Pg throws undefine_table error code */
};

const canonicalizeKeys = (obj) => {
  const retObj = {};
  for (const key of Object.keys(obj)) {
    retObj[canonicalCaseForDb(key)] = obj[key];
    if (obj[key] instanceof Array) {
      for (let index = 0; index < obj[key].length ; index++) {
        obj[key][index] = canonicalizeKeys(obj[key][index]);
      }
    }
  }
  return retObj;
};

const getModelObject = (ModelClass, schemaName, otherParams) => {
  let modelData = null;
  if (otherParams !== undefined) {
    modelData = Object.assign({}, { schemaName: schemaName.toUpperCase() }, canonicalizeKeys(otherParams));
  }
  else {
    modelData = { schemaName: schemaName.toUpperCase() };
  }
  const modelObject = new ModelClass(modelData);
  return modelObject;
};

const dbErrorCodeValidation = (dbErrorCode, errMsg) => {
  let msg = errMsg || 'Error occurred.';
  for (const errCode of Object.keys(allErrorCodes)) {
    if (dbErrorCode === errCode ) {
      msg = allErrorCodes[dbErrorCode];
      break;
    }
  }
  return msg;
};

module.exports = {
  error: (res, err) => {
    let msg;
    let status;
    const statusCode = {
    '42P01': 404,
    };
    if (err instanceof Object) {
      status = err.status || 500;
      if (status === 500) {
        msg = 'Error occurred.';
      }
      else {
        msg = err.message || 'Error occurred.';
      }
    }
    else {
      status = 500;
      msg = 'Error occurred.';
    }
    if (typeof err.code !== 'undefined' && err.code) {
      msg = dbErrorCodeValidation(err.code, err.message);
      status = statusCode[err.code] || status;
    }
    res.status(status);
    res.setHeader('Content-Type', 'application/json');
    logger.error(err);
    res.send(JSON.stringify({ message: msg }));
  },
  success: (res, obj, status = 200) => {
    res.status(status);
    res.setHeader('Content-Type', 'application/json');
    if (status === 204) {
      res.send();
    }
    else {
      res.send(JSON.stringify(obj));
    }
  },
  getUrl: req => {
    return url.format({
      protocol: req.protocol,
      host: req.get('host'),
      pathname: req.originalUrl,
    });
  },

  canonicalizeKeys: canonicalizeKeys,

  canonicalizeList: arr => {
    const retObj = [];
    for (const key of arr) {
      retObj.push(canonicalCaseForDb(key));
    }
    return retObj;
  },
  isBlank: str => {
    return str === undefined
            || str === null
            || ('' + str).search(/\S/) === -1
            || str === 'undefined';
  },
  canonicalCaseForDb: canonicalCaseForDb,
  getModelObject: getModelObject,
};
