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
*   store:
*     properties:
*       id:
*         type: integer
*       name:
*         type: string
*       domain:
*         type: string
*       phone:
*         type: string
*       state:
*         type: string
*       street:
*         type: string
*       status:
*         type: string
*/
module.exports = class Store extends BaseModel {
  get tableName() {
    return canonicalCaseForDb(this.schemaName + '.store');
  }
  get fields() {
    return new Set(canonicalizeList([ ...super.fields,
                                      'NAME', 'DOMAIN', 'STATE', 'STREET', 'STATUS', 'PHONE',
    ]));
  }

};
