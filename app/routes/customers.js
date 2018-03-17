'use strict';


/* global approot */
const {
  getAllCustomers,
  createCustomer,
  getCustomer,
} = require(approot + '/app/controllers/customers.js');

module.exports.routes = (router) => {
  /**
    * @swagger
    * /{dbSchema}/customers:
    *     get:
    *       tags:
    *         - customer
    *       description: Returns all customers
    *       parameters:
    *         - name: dbSchema
    *           description: dbSchema
    *           in: path
    *           type: string
    *           required: true
    *       produces:
    *         - application/json
    *       operationId: getAllCustomers
    *       responses:
    *         '500':
    *           description: error occured while retrieving
    *         '404':
    *           description: customer or dbschema not found
    *         '422':
    *           description: No id provided
    *         '200':
    *           description: get all customers
    *           schema:
    *             $ref: '#/definitions/customer'
    */
  router.get('/:ns/customers', getAllCustomers);
  /**
    * @swagger
    * /{dbSchema}/customers/id-{store_id}:
    *     get:
    *       tags:
    *         - customer
    *       description: Returns specific customer details
    *       produces:
    *         - application/json
    *       operationId: getCustomer
    *       parameters:
    *         - name: dbSchema
    *           description: dbSchema
    *           in: path
    *           type: string
    *           required: true
    *         - name: store_id
    *           description: store_id
    *           in: path
    *           type: integer
    *           required: true
    *       responses:
    *         '500':
    *           description: error occured while retrieving
    *         '404':
    *           description: customer or dbschema not found
    *         '422':
    *           description: No id provided
    *         '200':
    *           description: get specific customer details
    *           schema:
    *             $ref: '#/definitions/customer'
    */
  router.get('/:ns/customers/id-:store_id', getCustomer);
  /**
    * @swagger
    * /{dbSchema}/customers:
    *     post:
    *       tags:
    *         - customer
    *       description: Add a new customer
    *       produces:
    *         - application/json
    *       operationId: createCustomer
    *       parameters:
    *         - name: dbSchema
    *           description: dbSchema
    *           in: path
    *           type: string
    *           required: true
    *         - name: customerBody
    *           in: body
    *           required: true
    *           schema:
    *             type: object
    *             properties:
    *               first_name:
    *                 description: customer first name
    *                 type: string
    *               last_name:
    *                 description: customer last name
    *                 type: string
    *               phone:
    *                 description: customer phone number
    *                 type: string
    *               email:
    *                 description: customer email Id
    *                 type: string
    *               store_id:
    *                 description: store id
    *                 type: integer
    *       responses:
    *         '500':
    *           description: error occured while adding
    *         '422':
    *           description: mandatorycheck failed / Invalid store_id
    *         '404':
    *           description: dbschema or store not found
    *         '201':
    *           description: Returns details of added customer
    *           schema:
    *             $ref: '#/definitions/customer'
    */
  router.post('/:ns/customers', createCustomer);
};
