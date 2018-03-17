'use strict';

const rewire = require('rewire');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;

const Customer = require(approot + '/app/models/customer');
const {
  canonicalizeKeys,
  getModelObject,
} = require(approot + '/app/utils/common');

describe('controllers/customers', () => {
  let CustomersController;
  let FakeCustomerModel;
  const req = { query: {}, params: { ns: `${schemaName}` }, get: () => {} };
  const res = {
    status: sinon.stub(),
    setHeader: sinon.stub(),
    location: sinon.stub(),
  };
  let savedFindAll;
  let savedFindById;
  let savedCreate;

  before( (done) => {
    CustomersController = rewire(`${approot}/app/controllers/customers`);
    FakeCustomerModel = getModelObject(Customer, `${schemaName}`);
    savedFindAll = FakeCustomerModel.findAll;
    savedFindById = FakeCustomerModel.findById;
    savedCreate = FakeCustomerModel.create;
    Customer.prototype.findAll = sinon.stub();
    Customer.prototype.findById = sinon.stub();
    Customer.prototype.create = sinon.stub();
    done();
  });

  after( done => {
    Customer.prototype.findAll = savedFindAll;
    Customer.prototype.findById = savedFindById;
    Customer.prototype.create = savedCreate;
    done();
  });

  describe('GET customers', () => {
    const exampleCustomerArray = [
      { ID: 1, FIRST_NAME: 'CUSTOMER1', LAST_NAME: 'CUSTOMER1', PHONE: '9840725324', EMAIL: 'SS@GMAIL.COM', STORE_ID: 1 },
      { ID: 2, FIRST_NAME: 'CUSTOMER1', LAST_NAME: 'CUSTOMER1', PHONE: '9840725324', EMAIL: 'SS@GMAIL.COM', STORE_ID: 1 },
    ];

    it('responds correctly when multiple customers found', (done) => {
      FakeCustomerModel.findAll.resolves(exampleCustomerArray);
      res.send = makeSendVerifier(done, res.status, 200, JSON.stringify(exampleCustomerArray));
      CustomersController.getAllCustomers(req, res);
    });

    it('calls findById with ID in the params', (done) => {
      req.params.id = 42;
      FakeCustomerModel.findById.resolves([ exampleCustomerArray ]);
      res.send = () => {
        try {
          expect(FakeCustomerModel.findById)
            .to.have.been.calledWith(42);
          done();
        }
        catch (err) {
          done(err);
        }
      };
      CustomersController.getCustomer(req, res);
      delete (req.params['id']);
    });

    it('calls without ID in the params', (done) => {
      res.send = makeSendVerifier(done, res.status, 422, JSON.stringify({ message: 'customer id or store id not provided' }));
      CustomersController.getCustomer(req, res);
    });

    it('responds correctly with no feature found', (done) => {
      req.params.id = 4;
      FakeCustomerModel.findById.resolves([]);
      res.send = makeSendVerifier(done, res.status, 404, JSON.stringify({ message: 'Customer not found.' }));
      CustomersController.getCustomer(req, res);
      delete (req.params['id']);
    });
  });

  describe('POST customer', () => {
    const exampleCustomer = canonicalizeKeys({
      ID: 1, FIRST_NAME: 'CUSTOMER1', LAST_NAME: 'CUSTOMER1', PHONE: '9840725324', EMAIL: 'SS@GMAIL.COM', STORE_ID: 1,
    });

    it('calls create method with a correctly constructed customer', done => {
      FakeCustomerModel.create.resolves(getModelObject(Customer, `${schemaName}`, exampleCustomer));
      req.body = Object.assign({}, exampleCustomer);
      delete (req.body['id']);
      res.send = makeSendVerifier(done, res.status, 201, JSON.stringify(exampleCustomer));
      CustomersController.createCustomer(req, res);
    });

    it('calls create method - mandatory fields check', done => {
      req.body = Object.assign({}, {});
      const errorMessage = {
        message: 'The following fields are mandatory - first_name, last_name, email, phone.',
      };
      res.send = makeSendVerifier(done, res.status, 422, JSON.stringify(errorMessage));
      CustomersController.createCustomer(req, res);
    });

  });
});

function makeSendVerifier(done, statusStub, expectedStatus, expectedResponse) {
  return (responseString) => {
    try {
      if (expectedResponse) {
        expect(JSON.parse(responseString))
          .to.deep.equal(JSON.parse(expectedResponse));
      }
      expect(statusStub).to.have.been.calledWith(expectedStatus);
      done();
    }
    catch (err) {
      done(err);
    }
  };
}
