'use strict';


/* global approot */
const {
  getAllStores,
  createStore,
  getStore,
  updateStore,
} = require(approot + '/app/controllers/stores.js');

module.exports.routes = (router) => {
  /**
    * @swagger
    * /{dbSchema}/stores:
    *     get:
    *       tags:
    *         - store
    *       description: Returns all stores
    *       parameters:
    *         - name: dbSchema
    *           description: dbSchema
    *           in: path
    *           type: string
    *           required: true
    *       produces:
    *         - application/json
    *       operationId: getAllStores
    *       responses:
    *         '500':
    *           description: error occured while retrieving
    *         '404':
    *           description: store or dbschema not found
    *         '422':
    *           description: No id provided
    *         '200':
    *           description: get all stores
    *           schema:
    *             $ref: '#/definitions/store'
    */
  router.get('/:ns/stores', getAllStores);
  /**
    * @swagger
    * /{dbSchema}/stores:
    *     post:
    *       tags:
    *         - store
    *       description: Add a new store
    *       produces:
    *         - application/json
    *       operationId: createStore
    *       parameters:
    *         - name: dbSchema
    *           description: dbSchema
    *           in: path
    *           type: string
    *           required: true
    *         - name: storeBody
    *           in: body
    *           required: true
    *           schema:
    *             type: object
    *             properties:
    *               phone:
    *                 description: store phone number
    *                 type: string
    *               name:
    *                 description: store name
    *                 type: string
    *               domain:
    *                 description: store domain Url
    *                 type: string
    *               state:
    *                 description: store located state
    *                 type: string
    *               street:
    *                 description: store located street
    *                 type: string
    *               status:
    *                 description: store active status
    *                 type: string
    *       responses:
    *         '500':
    *           description: error occured while adding
    *         '422':
    *           description: mandatorycheck failed
    *         '201':
    *           description: Returns details of added store
    *         '404':
    *           description: dbschema not found
    *           schema:
    *             $ref: '#/definitions/store'
    */
  router.post('/:ns/stores', createStore);
  /**
    * @swagger
    * /{dbSchema}/stores/{id}:
    *     get:
    *       tags:
    *         - store
    *       description: Returns specific store details
    *       produces:
    *         - application/json
    *       operationId: getStore
    *       parameters:
    *         - name: dbSchema
    *           description: dbSchema
    *           in: path
    *           type: string
    *           required: true
    *         - name: id
    *           description: store id
    *           in: path
    *           type: integer
    *           required: true
    *       responses:
    *         '500':
    *           description: error occured while retrieving
    *         '404':
    *           description: store or dbschema not found
    *         '422':
    *           description: No id or  provided
    *         '200':
    *           description: Returns specific store details
    *           schema:
    *             $ref: '#/definitions/store'
    */
  router.get('/:ns/stores/:id', getStore);
  /**
    * @swagger
    * /{dbSchema}/stores/{id}:
    *     put:
    *       tags:
    *         - store
    *       description: update a store based on store id
    *       produces:
    *         - application/json
    *       operationId: updateStore
    *       parameters:
    *         - name: dbSchema
    *           description: dbSchema
    *           in: path
    *           type: string
    *           required: true
    *         - name: id
    *           description: store id
    *           in: path
    *           type: integer
    *           required: true
    *         - name: storeBody
    *           in: body
    *           required: true
    *           schema:
    *             type: object
    *             properties:
    *               phone:
    *                 description: store phone number
    *                 type: string
    *               name:
    *                 description: store name
    *                 type: string
    *               domain:
    *                 description: domain name
    *                 type: string
    *               state:
    *                 description: state name
    *                 type: string
    *               street:
    *                 description: street name
    *                 type: string
    *               status:
    *                 description: status of the store
    *                 type: string
    *       responses:
    *         '500':
    *           description: error occured while updation
    *         '404':
    *           description: store or dbschema not found
    *         '422':
    *           description: No id provided
    *         '200':
    *           description: Returns details of updated store
    *           schema:
    *             $ref: '#/definitions/store'
    */
  router.put('/:ns/stores/:id', updateStore);
  /**
    * @swagger
    * /{dbSchema}/stores:
    *     get:
    *       tags:
    *         - store
    *       description: Returns all stores
    *       parameters:
    *         - name: dbSchema
    *           description: dbSchema
    *           in: path
    *           type: string
    *           required: true
    *         - name: name
    *           description: Name of the store (case-insensitive)
    *           in: query
    *           type: string
    *         - name: count
    *           description: Print customer count
    *           in: query
    *           type: integer
    *       produces:
    *         - application/json
    *       operationId: getAllStores
    *       responses:
    *         '500':
    *           description: error occured while retrieving
    *         '404':
    *           description: store or dbschema not found.
    *         '200':
    *           description: get all stores
    *           schema:
    *           type: "array"
    *           items:
    *             $ref: '#/definitions/store'
    */
  router.get('/:ns/stores', getAllStores);
};
