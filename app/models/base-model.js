'use strict';


const config = require('config');
const knex = require('knex')(config.get('rdbms'));
const Promise = require('bluebird');
const constants = require(approot + '/app/utils/constants');

/* global approot */
const {
  isBlank,
  canonicalizeList,
  canonicalCaseForDb,
} = require(approot + '/app/utils/common');

module.exports = class BaseModel {
  constructor(obj) {
    this.schemaName = obj.schemaName;
    this.data = {};
    for (const field of this.fields) {
      if (obj[field] !== undefined) {
        this.data[field] = obj[field];
      }
    }
  }

  setDataField(obj) {
    this.data = {};
    for (const field of this.fields) {
      if (obj[field] !== undefined) {
        this.data[field] = obj[field];
      }
    }
  }

  get fields() {
    return new Set(canonicalizeList([ 'id' ]));
  }

  _baseQuery() {
    return knex.select(...this.fields)
      .from(this.tableName);
  }

  findAll() {
    return this._baseQuery();
  }

  findAllWithCustomerCount() {
    return knex.raw('select count(customer.id),store.name,store.id from ' + this.schemaName + '.customer ,' + this.schemaName + '.store where customer.store_id=store.id group by store.id');

  }

  findByStoreByName(req) {
    return knex.raw('select id,name from ' + this.schemaName + '.store where name ilike \'%' + req.name + '%\' limit 5');

  }
  findById(id) {
    return this.findByField('id', id);
  }

  findByField(name, value) {
    if (value instanceof Array) {
      return this._baseQuery().whereIn(canonicalCaseForDb(name), value);
    }
    else {
      let valueObj = {};
      valueObj[name] = value;
      return this._baseQuery().where(canonicalCaseForDb(name), valueObj[name]);
    }
  }

  findByFields(names, values) {
    let baseQuery = this._baseQuery();
    for (const name of names) {
      baseQuery = baseQuery.where(canonicalCaseForDb(name), newValues[name]);
    }
    return baseQuery;
  }

  create() {
    return Promise.resolve()
      .then(() => {
        return knex(this.tableName)
          .returning(canonicalCaseForDb('id'))
          .insert(this._filterInsertFields(this.data));
      })
      .then(idArray => {
        this.data[canonicalCaseForDb('id')] = idArray[0];
        return this;
      })
      .catch(err => {
        this._updateViolationException(err);
        throw err;
      });
  }

  update(updatedData) {
    const updateObj = this._filterUpdateFields(updatedData);
    Object.assign(this.data, updateObj);
    return knex(this.tableName)
      .where(canonicalCaseForDb('id'), this.data[canonicalCaseForDb('id')])
      .returning([ ...this.fields ])
      .update(this.data)
      .then(objArray => {
        if (objArray.length) this.data = objArray[0];
        return objArray.length;
      })
      .catch(err => {
        this._updateViolationException(err);
        throw err;
      });
  }

  _updateViolationException(err) {
    if (err instanceof Object && !isBlank(err.constraint)) {
      const violationmessage = constants.getDbContraintViolationMsg(err.constraint);
      if (violationmessage) {
        err.status = 422;
        err.name = 'constraintviolation';
        err.message = violationmessage;
        const firstopen = err.detail.indexOf('(');
        const secondclose = err.detail.indexOf(')', err.detail.indexOf('='));
        err.message = err.detail.substr(firstopen, secondclose - firstopen + 1) + err.message;
      }
    }
  }

  _filterInsertFields(dataObj) {
    const retObj = Object.assign({}, dataObj);
    for (const toDelete of canonicalizeList([
      'ID' ])) {
      delete retObj[toDelete];
    }
    return retObj;
  }

  _filterUpdateFields(dataObj) {
    const retObj = Object.assign({}, dataObj);
    for (const toDelete of canonicalizeList([
      'ID' ])) {
      delete retObj[toDelete];
    }
    return retObj;
  }

};
