'use strict';


/* global approot */
const {
  canonicalizeList,
  canonicalCaseForDb,
} = require(approot + '/app/utils/common');

const BaseModel = require(approot + '/app/models/base-model');
/**
* @swagger
* definitions:
*   customer:
*     properties:
*       id:
*         type: integer
*       first_name:
*         type: string
*       last_name:
*         type: string
*       phone:
*         type: string
*       email:
*         type: string
*       store_id:
*         type: integer
*/
module.exports = class Customer extends BaseModel {
  get tableName() {
    return canonicalCaseForDb(this.schemaName + '.customer');
  }
  get fields() {
    return new Set(canonicalizeList([ ...super.fields,
                                      'FIRST_NAME', 'LAST_NAME', 'EMAIL', 'PHONE', 'STORE_ID',
    ]));
  }
};
