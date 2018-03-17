'use strict';

const chai = require('chai');

const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const sinonChai = require('sinon-chai');
chai.use(sinonChai);

const expect = chai.expect;

/* global approot, schemaName */
const Customer = require(`${approot}/app/models/customer`);
const {
  canonicalizeList,
  canonicalCaseForDb,
  getModelObject,
} = require(`${approot}/app/utils/common`);

describe('models/customer', () => {
  describe('getter fields', () => {
    it('adds specific fields', () => {
      const fieldSet = getModelObject(Customer, `${schemaName}`).fields;
      expect([ ...fieldSet ]).to.include.members(canonicalizeList([
        'store_id', 'first_name', 'last_name', 'phone', 'email',
      ]));
    });
  });

  describe('tableName getter function', () => {
    const table = getModelObject(Customer, `${schemaName}`).tableName;
    it ('sets table name to customer', () => {
      expect(table).to.equal(canonicalCaseForDb(`${schemaName}.customer`));
    });
  });
});
