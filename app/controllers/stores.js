'use strict';

/* global approot */
const Store = require(approot + '/app/models/store');
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
  getAllStores: (req, res) => {
    const schemaName = req.params.ns.toUpperCase();
    const store = getModelObject(Store, schemaName);
    if (Object.keys(req.query).length > 0 && req.query.count === '1' && !(typeof req.query.name !== 'undefined' && req.query.name)) {
      store.findAllWithCustomerCount()
             .then((stores) => {
               success(res, stores.rows);
             })
             .catch((err) => {
               error(res, err);
             });
    }
    else if (Object.keys(req.query).length > 0 && (typeof req.query.name !== 'undefined' && req.query.name)) {
      store.findByStoreByName(req.query)
             .then((stores) => {
               success(res, stores.rows);
             })
             .catch((err) => {
               error(res, err);
             });

    }
    else {
      store.findAll()
         .then((stores) => {
           success(res, stores);
         })
         .catch((err) => {
           error(res, err);
         });
    }
  },

  getStore: (req, res) => {
    const schemaName = req.params.ns.toUpperCase();
    const store = getModelObject(Store, schemaName);
    try {
      _getStore(req.params, store)
      .then(retval => {
        success(res, retval);
      })
      .catch(err => {
        error(res, err);
      });
    }
    catch (err) {
      error(res, err);
    }
  },

  createStore: (req, res) => {
    const schemaName = req.params.ns.toUpperCase();
    const inputValidationError = validateInputFields(req.body, [ 'phone', 'name', 'domain', 'street', 'state' ], [ 'phone', 'name', 'domain', 'street', 'state' ]);
    if ( inputValidationError !== null ) {
      error(res, inputValidationError);
      return;
    }
    const dataValidationError = dataValidation(req.body);
    if ( dataValidationError !== null ) {
      error(res, dataValidationError);
      return;
    }
    const store = getModelObject(Store, schemaName, canonicalizeKeys(req.body));
    store.create()
      .then(createdStore => {
        res.location(getUrl(req) + '/' + createdStore.data[canonicalCaseForDb('ID')]);
        success(res, createdStore.data, 201);
      })
      .catch(err => {
        error(res, err);
      });
  },

  updateStore: (req, res) => {
    const schemaName = req.params.ns.toUpperCase();
    const store = getModelObject(Store, schemaName);
    _getStore(req.params, store)
      .then(storeData => {
        const inputValidationError = validateInputFields(req.body,  [ ], [ 'phone', 'name', 'domain', 'street', 'state' ]);
        if ( inputValidationError !== null ) {
          error(res, inputValidationError);
          return;
        }
        const dataValidationError = dataValidation(req.body);
        if ( dataValidationError !== null ) {
          error(res, dataValidationError);
          return;
        }
        store.setDataField(storeData);
        return store.update(canonicalizeKeys(req.body))
          .then(rowsAffected => {
            logger.log(`${rowsAffected} row updated (ID ${store.data[canonicalCaseForDb('ID')]})`);
            success(res, store.data, 200);
          });
      })
      .catch(err => {
        error(res, err);
      });
  },

};

function _getStore(params, store) {
  let pending;
  if (params.id !== undefined) {
    pending = store.findById(params.id);
    
  }
  else {
    throw {
      name: '',
      status: 422,
      message: 'store id is not provided',
    };
  }
  return pending
    .then(storeArr => {
      if (storeArr.length === 0) {
        throw {
          name: 'Not Found',
          status: 404,
          message: 'Store not found.',
        };
      }
      return storeArr[0];
    });
}
