'use strict';

const phone = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
const email  = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const domain = /^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/;
const status = /^(true|false|TRUE|FALSE)$/;
const count = /^(1)$/;
const {
  isBlank,
} = require(`${approot}/app/utils/common`);

module.exports = {
dataValidation: (params) => {

  if ('email' in params && !(email.test(params.email))) {
    return {
        name: 'Mandatory Check',
        status: 422,
        message: 'Invalid format of email id',
    };
  }

  if ('phone' in params && !(phone.test(params.phone))) {
    return {
        name: 'Mandatory Check',
        status: 422,
        message: 'Invalid format of phone number',
    };
  }

  if ('domain' in params && !(domain.test(params.domain))) {
    return {
        name: 'Mandatory Check',
        status: 422,
        message: 'Invalid format of domain name',
    };
  }

  if ('status' in params && !(status.test(params.status))) {
    return {
        name: 'Mandatory Check',
        status: 422,
        message: 'Invalid format of status, accept either true or false',
    };
  }

  if ('count' in params && !(count.test(params.count))) {
    return {
          name: 'Mandatory Check',
          status: 422,
          message: 'Invalid format of count, accept 1',
    };
  }
  return null;
},
  /* - Checks if fields in mandatoryFields are provided and non-null.
     - Performs custom validations for fields in otherFields */
validateInputFields: (inputParams, mandatoryFields, otherFields) => {
  let msg = '';
  const mandatoryFieldsList = [];
  mandatoryFields.forEach(function(field) {
    if (isBlank(inputParams[field])) {
      mandatoryFieldsList.push(field);
    }
  });

  switch (mandatoryFieldsList.length) {
    case 0:
      break;
    case 1:
      msg = mandatoryFieldsList[0] + ' must be provided.';
      break;
    default:
      msg = 'The following fields are mandatory - ' + mandatoryFieldsList.join(', ') + '.';
  }

  if (isBlank(msg)) {
    otherFields.forEach(function(field) {
      if (field in inputParams) {
        if (isBlank(inputParams[field])) {
          msg += field + ' must be provided.';
        }
      }
    });
  }

  if (!isBlank(msg)) {
    return {
        name: 'Mandatory Check',
        status: 422,
        message: msg,
    };
  }
  else {
    return null;
  }
},
};
