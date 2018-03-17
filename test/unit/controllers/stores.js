'use strict';

const rewire = require('rewire');
const sinon = require('sinon');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const sinonChai = require('sinon-chai');
chai.use(sinonChai);
const expect = chai.expect;

const Store = require(approot + '/app/models/store');
const {
  canonicalizeKeys,
  getModelObject,
} = require(approot + '/app/utils/common');

describe('controllers/stores', () => {
  let StoresController;
  let FakeStoreModel;
  const req = { query: {}, params: { ns: `${schemaName}` }, get: () => {} };
  const res = {
    status: sinon.stub(),
    setHeader: sinon.stub(),
    location: sinon.stub(),
  };
  let savedFindAll;
  let savedFindById;
  let savedCreate;
  let savedUpdate;

  before( (done) => {
    /* global approot */
    StoresController = rewire(`${approot}/app/controllers/stores`);
    FakeStoreModel = getModelObject(Store, `${schemaName}`);
    savedFindAll = FakeStoreModel.findAll;
    savedFindById = FakeStoreModel.findById;
    savedCreate = FakeStoreModel.create;
    savedUpdate = FakeStoreModel.update;
    Store.prototype.findAll = sinon.stub();
    Store.prototype.findById = sinon.stub();
    Store.prototype.findByField = sinon.stub();
    Store.prototype.create = sinon.stub();
    Store.prototype.update = sinon.stub();
    done();
  });

  after( done => {
    Store.prototype.findAll = savedFindAll;
    Store.prototype.findById = savedFindById;
    Store.prototype.create = savedCreate;
    Store.prototype.update = savedUpdate;
    done();
  });

  describe('GET stores', () => {
    const exampleStoreArray = [
      { ID: 1, NAME: 'A', PHONE: '9840725324', DOMAIN: 'asaa.com', STREET: 'HEE', STATE: 'A', STATUS: 'true' },
      { ID: 2, NAME: 'B', PHONE: '9621312661', DOMAIN: 'abcs.com', STREET: 'HEE', STATE: 'A', STATUS: 'true' },
    ];

    it('responds correctly when multiple stores found', (done) => {
      FakeStoreModel.findAll.resolves(exampleStoreArray);
      res.send = makeSendVerifier(done, res.status, 200, JSON.stringify(exampleStoreArray));
      StoresController.getAllStores(req, res);
    });

    it('calls findById with ID in the params', (done) => {
      req.params.id = 42;
      FakeStoreModel.findById.resolves([ exampleStoreArray ]);
      res.send = () => {
        try {
          expect(FakeStoreModel.findById)
            .to.have.been.calledWith(42);
          done();
        }
        catch (err) {
          done(err);
        }
      };
      StoresController.getStore(req, res);
      delete (req.params['id']);
    });

    it('calls without ID in the params', (done) => {
      res.send = makeSendVerifier(done, res.status, 422, JSON.stringify({ message: 'store id is not provided' }));
      StoresController.getStore(req, res);
    });

    it('responds correctly with no store found', (done) => {
      req.params.id = 41;
      FakeStoreModel.findById.resolves([]);
      res.send = makeSendVerifier(done, res.status, 404, JSON.stringify({ message: 'Store not found.' }));
      StoresController.getStore(req, res);
      delete (req.params['id']);
    });
  });

  describe('POST/PUT store', () => {
    const exampleStore = canonicalizeKeys({
      ID: 1, NAME: 'A', PHONE: '9094954052', DOMAIN: 'abbb.com', STREET: 'HEE', STATE: 'A', STATUS: 'true',
    });

    it('calls create method with a correctly constructed store', done => {
      FakeStoreModel.create.resolves(getModelObject(Store, `${schemaName}`, exampleStore));
      req.body = Object.assign({}, exampleStore);
      delete (req.body['id']);
      res.send = makeSendVerifier(done, res.status, 201, JSON.stringify(exampleStore));
      StoresController.createStore(req, res);
    });

    it('calls create method - mandatory fields check', done => {
      req.body = Object.assign({}, {});
      const errorMessage = {
        message: 'The following fields are mandatory - phone, name, domain, street, state.',
      };
      res.send = makeSendVerifier(done, res.status, 422, JSON.stringify(errorMessage));
      StoresController.createStore(req, res);
    });

    it('calls update method with a correctly constructed store', done => {
      FakeStoreModel.findById.resolves([ exampleStore ]);
      FakeStoreModel.update.resolves(1);
      req.body = exampleStore;
      req.params.id = 1;
      res.send = makeSendVerifier(done, res.status, 200, JSON.stringify(exampleStore));
      StoresController.updateStore(req, res);
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
