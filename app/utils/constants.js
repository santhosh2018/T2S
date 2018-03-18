'use strict';

const ConstraintViolation = {
  STORE_NAME_UNIQUE: 'Store Name Already Exists.',
  CUSTOMER_STORE_ID_FOREIGN: 'Invalid store_id for Customer.',
  CUSTOMER_PHONE_EMAIL_STORE_ID_UNIQUE: 'Customer Exists in Store Already.',
};

module.exports = {
  getDbContraintViolationMsg: (contraintname) => {
    return ' ' + ConstraintViolation[contraintname.toUpperCase().substr(contraintname.indexOf('_') + 1)];
  },
};
