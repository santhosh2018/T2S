'use strict';

/* global approot */
const Customer = require(approot + '/app/models/customer');
const logger = require(approot + '/app/utils/logger');


const {
  success,
  error,
  getUrl,
  canonicalizeKeys,
  canonicalCaseForDb,
  getModelObject,
} = require(approot + '/app/utils/common');

const {
  validateInputFields,
dataValidation,
} = require(approot + '/app/utils/validator');

module.exports = {
  getAllCustomers: (req, res) => {
    const schemaName = req.params.ns.toUpperCase();
    const customer = getModelObject(Customer, schemaName);
    // Perform a search if query parameters are passed.
    customer.findAll()
        .then((customers) => {
          success(res, customers);
        })
        .catch((err) => {
          error(res, err);
        });
  },

  getCustomer: (req, res) => {
    const schemaName = req.params.ns.toUpperCase();
    const customer = getModelObject(Customer, schemaName);
    try {
      _getCustomer(req.params, customer)
        .then((retval) => {
          success(res, retval);
        })
        .catch((err) => {
          error(res, err);
        });
    }
    catch (err) {
      error(res, err);
    }
  },

  createCustomer: (req, res) => {
    const schemaName = req.params.ns.toUpperCase();
    const inputValidationError = validateInputFields(req.body, [ 'first_name', 'last_name', 'email', 'phone' ], [ 'first_name', 'last_name', 'email', 'phone' ]);
    if ( inputValidationError !== null ) {
      error(res, inputValidationError);
      return;
    }
    const dataValidationError = dataValidation(req.body);
    if ( dataValidationError !== null ) {
      error(res, dataValidationError);
      return;
    }
    const customer = getModelObject(Customer, schemaName, canonicalizeKeys(req.body));
    customer.create()
      .then(createdCustomer => {
        res.location(getUrl(req) + '/' + createdCustomer.data[canonicalCaseForDb('ID')]);
        success(res, createdCustomer.data, 201);
      })
      .catch(err => {
        error(res, err);
      });
  },

  updateCustomer: (req, res) => {
    const schemaName = req.params.ns.toUpperCase();
    const customer = getModelObject(Customer, schemaName);
    _getCustomer(req.params, customer)
      .then(customerData => {
        const inputValidationError = validateInputFields(req.body, [],  [ 'email', 'phone', 'first_name', 'last_name' ]);
        if ( inputValidationError !== null ) {
          error(res, inputValidationError);
          return;
        }
        const dataValidationError = dataValidation(req.body);
        if ( dataValidationError !== null ) {
          error(res, dataValidationError);
          return;
        }
        customer.setDataField(customerData);
        return customer.update(canonicalizeKeys(req.body))
          .then(rowsAffected => {
            logger.log(`${rowsAffected} row updated (ID ${customer.data[canonicalCaseForDb('ID')]})`);
            success(res, customer.data, 200);
          });
      })
      .catch(err => {
        error(res, err);
      });
  },

};

function _getCustomer(params, customer) {
  let pending;
  if (params.id !== undefined) {
    pending = customer.findById(params.id);
    
  }
  else if (params.store_id !== undefined) {
    pending = customer.findByField('STORE_ID', params.store_id);
    
  }
  else {
    throw {
      name: '',
      status: 422,
      message: 'customer id or store id not provided',
    };
  }
  return pending
    .then(customerArr => {
      if (customerArr.length === 0) {
        throw {
          name: 'Not Found',
          status: 404,
          message: 'Customer not found.',
        };
      }
      return customerArr[0];
    });
}
