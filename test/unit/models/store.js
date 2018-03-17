'use strict';

const chai = require('chai');

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const expect = chai.expect;

/* global approot, schemaName */
const Store = require(`${approot}/app/models/store`);
const {
  canonicalizeList,
  canonicalCaseForDb,
  getModelObject,
} = require(`${approot}/app/utils/common`);

describe('models/store', () => {
  describe('getter fields', () => {
    it('adds specific fields', () => {
      const fieldSet = getModelObject(Store, `${schemaName}`).fields;
      expect([ ...fieldSet ]).to.include.members(canonicalizeList([
 'name', 'phone', 'domain', 'state', 'street', 'status',
      ]));
    });
  });

  describe('tableName getter function', () => {
    const table = getModelObject(Store, `${schemaName}`).tableName;
    it ('sets table name to store', () => {
      expect(table).to.equal(canonicalCaseForDb(`${schemaName}.store`));
    });
  });
});
