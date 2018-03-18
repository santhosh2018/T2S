


User stories   

you can do your verification any one of the ways.

- Swagger  ( refer http://localhost:3000/api-docs/)
- CURL  ( follow given steps in this file )
- POSTMAN ( refer postman directory in app root, contains test suite and images)



<b>Story 8 - Authentication</b>

- End-user should validate their correct username & password to access the API service.
- Currently, it has 2 pre-defined users (test/test,santhosh/santhosh) which are stored in the variable level itself. (time constraint)
- Stored hashed password only
- follow this way to hash it.

- This is the very initial step to authenticate yourself and keep this token for a while

curl -X POST "http://localhost:3000/login" -H "accept: application/json" -H "Content-Type: application/json" -d "{ \"name\": \"test\" , \"password\": \"test\"}"

{"message":"successfully authenticated!","token":"JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTIxMjY4NTAzfQ.pEyaG-IrA8hCNxa6lvY279VfD_eaBGqVCtTHHeSYhoo"}

This token will be used in the subsequent API and yet to implement signup/logout mechanism.

Enhancements: 

- Implement all endpoints to signup/sign-in/logout
- Maintain User attributes in DB level ( Knew that its bad way to maintain in the file itself).


<b>Story 3 - Update a Store</b>

- Before updating the store make sure that store is available/created on DB.
- Strict data validation made on phone, domain, email attributes

curl -X POST "http://localhost:3000/api/dev/stores" -H "accept: application/json" -H "Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTIxMjY2NzgxfQ.HsWtTxejN5fgrO4C-Lp18JQi-1Oe-Tir19T_2bqrh54" -H "Content-Type: application/json" -d "{ \"phone\": \"9840725324\", \"name\": \"True2Success\", \"domain\": \"t2s.com\", \"state\": \"TN\", \"street\": \"chennai\", \"status\": \"true\"}"

Response body

{
  "name": "True2Success",
  "domain": "t2s.com",
  "state": "TN",
  "street": "chennai",
  "status": "true",
  "phone": "9840725324",
  "id": 16
}

Update mobile number for a store: ( you can edit all information here. no restriction made )

curl -X PUT "http://localhost:3000/api/dev/stores/16" -H "accept: application/json" -H "Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTIxMjY2NzgxfQ.HsWtTxejN5fgrO4C-Lp18JQi-1Oe-Tir19T_2bqrh54" -H "Content-Type: application/json" -d "{ \"phone\": \"9094954052\"}"

Response body

{
  "id": 16,
  "name": "True2Success",
  "domain": "t2s.com",
  "state": "TN",
  "street": "chennai",
  "status": "true",
  "phone": "9094954052"
}

Explanation :

"http://localhost:3000/api/dev/stores"  

- running on 3000 port on the local machine
- API is a base path of all REST
- dev is a schema name created during deployment ( check INSTALL.txt). you will be observed 'schema not found' if schema not in DB.

curl -X POST "http://localhost:3000/api/noschema/stores" -H "accept: application/json" -H "Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTIxMjY2NzgxfQ.HsWtTxejN5fgrO4C-Lp18JQi-1Oe-Tir19T_2bqrh54" -H "Content-Type: application/json" -d "{ \"phone\": \"9840725324\", \"name\": \"True2Success\", \"domain\": \"t2s.com\", \"state\": \"TN\", \"street\": \"chennai\", \"status\": \"true\"}"

Response body

{
  "message": "Schema not found."
}


<b>Story 1 - Retrieving a Store by ID</b>

- It's retrieving a store by store's id.

curl -X GET "http://localhost:3000/api/dev/stores/17" -H "accept: application/json" -H "Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTIxMjY2NzgxfQ.HsWtTxejN5fgrO4C-Lp18JQi-1Oe-Tir19T_2bqrh54"

Response body
{
  "id": 17,
  "name": "True2Success",
  "domain": "t2s.com",
  "state": "TN",
  "street": "chennai",
  "status": "true",
  "phone": "9840725324"
}

<b>Story 2 - Retrieving list of Stores</b>

- it's retrieving list of all stores.

curl -X GET "http://localhost:3000/api/dev/stores" -H "accept: application/json" -H "Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTIxMjY2NzgxfQ.HsWtTxejN5fgrO4C-Lp18JQi-1Oe-Tir19T_2bqrh54"

Response body

[
  {
    "id": 1,
    "name": "ABCD",
    "domain": "abcd.com",
    "state": "string",
    "street": "string",
    "status": "true",
    "phone": "9213219121"
  },
  {
    "id": 17,
    "name": "True2Success",
    "domain": "t2s.com",
    "state": "TN",
    "street": "chennai",
    "status": "true",
    "phone": "9840725324"
  }
]


<b>Story 4 - Retrieving the list of Stores w/ total customers count</b>


- Make sure that enable count params to '1' ( silently skipped other than 1)
- fail to pass 'count=1' will consider retrieving all customers without count


curl -X GET "http://localhost:3000/api/dev/stores?count=1" -H "accept: application/json" -H "Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTIxMjY2NzgxfQ.HsWtTxejN5fgrO4C-Lp18JQi-1Oe-Tir19T_2bqrh54"

Response body

[
  {
    "count": "1",
    "name": "True2Success",
    "id": 17
  },
  {
    "count": "22",
    "name": "ABCD",
    "id": 1
  }
]


<b>Story 5 - Retrieve a Stores Customers</b>

- Accept store id as an input params

curl -X GET "http://localhost:3000/api/dev/customers/id-1" -H "accept: application/json" -H "Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTIxMjY2NzgxfQ.HsWtTxejN5fgrO4C-Lp18JQi-1Oe-Tir19T_2bqrh54"

{
  "id": 2,
  "first_name": "santhosh",
  "last_name": "kumar",
  "email": "string",
  "phone": "string",
  "store_id": 1
}



<b>Story 6 - Create a Customer</b>

- All fields are mandatory here

curl -X POST "http://localhost:3000/api/dev/customers" -H "accept: application/json" -H "Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTIxMjY2NzgxfQ.HsWtTxejN5fgrO4C-Lp18JQi-1Oe-Tir19T_2bqrh54" -H "Content-Type: application/json" -d "{ \"first_name\": \"santhosh\", \"last_name\": \"kumar\", \"phone\": \"9840725324\", \"email\": \"ss@gmai.com\", \"store_id\": 17}"

Response body

{
  "first_name": "santhosh",
  "last_name": "kumar",
  "email": "ss@gmai.com",
  "phone": "9840725324",
  "store_id": 17,
  "id": 28
}

Enhancement :

- Avoid duplicate records creating if a particular customer belongs to multiple stores. ( DB normalization and customer-store reference table is required)



<b>Story 7 - Search for Store</b>

- it's case insensitive search 


curl -X GET "http://localhost:3000/api/dev/stores?name=success" -H "accept: application/json" -H "Authorization: JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTIxMjY2NzgxfQ.HsWtTxejN5fgrO4C-Lp18JQi-1Oe-Tir19T_2bqrh54"

Response body

[
  {
    "id": 17,
    "name": "True2Success"
  }
]



<b>Story 9 - Database Optimisation</b>

- Given requirement is very limited one and applied few RDBMS concepts.
- There are two tables are created and applied index on store.name as core search is running based on this field.
- The reference table is not maintained to avoid duplicate customers ( YET to IMPLEMENT )
    Customer -> customertoStoreReference <- Store 


fg=# \d+ dev.customer
                                                          Table "dev.customer"
   Column   |          Type          |                         Modifiers                         | Storage  | Stats target | Description 
------------+------------------------+-----------------------------------------------------------+----------+--------------+-------------
 id         | integer                | not null default nextval('dev.customer_id_seq'::regclass) | plain    |              | 
 first_name | character varying(255) | not null                                                  | extended |              | 
 last_name  | character varying(255) | not null                                                  | extended |              | 
 phone      | character varying(255) | not null                                                  | extended |              | 
 email      | character varying(255) | not null                                                  | extended |              | 
 store_id   | integer                |                                                           | plain    |              | 
Indexes:
    "customer_pkey" PRIMARY KEY, btree (id)
    "dev_customer_phone_email_store_id_unique" UNIQUE CONSTRAINT, btree (phone, email, store_id)
Foreign-key constraints:
    "dev_customer_store_id_foreign" FOREIGN KEY (store_id) REFERENCES dev.store(id)

fg=# \d+ dev.store
                                                        Table "dev.store"
 Column |          Type          |                       Modifiers                        | Storage  | Stats target | Description 
--------+------------------------+--------------------------------------------------------+----------+--------------+-------------
 id     | integer                | not null default nextval('dev.store_id_seq'::regclass) | plain    |              | 
 name   | character varying(255) | not null                                               | extended |              | 
 phone  | character varying(255) | not null                                               | extended |              | 
 domain | character varying(255) | not null                                               | extended |              | 
 street | character varying(255) | not null                                               | extended |              | 
 state  | character varying(255) | not null                                               | extended |              | 
 status | character varying(255) |                                                        | extended |              | 
Indexes:
    "store_pkey" PRIMARY KEY, btree (id)
    "dev_store_name_unique" UNIQUE CONSTRAINT, btree (name)
Referenced by:
    TABLE "dev.customer" CONSTRAINT "dev_customer_store_id_foreign" FOREIGN KEY (store_id) REFERENCES dev.store(id)

fg=# \d+ dev.user
                                                         Table "dev.user"
  Column  |          Type          |                       Modifiers                       | Storage  | Stats target | Description 
----------+------------------------+-------------------------------------------------------+----------+--------------+-------------
 id       | integer                | not null default nextval('dev.user_id_seq'::regclass) | plain    |              | 
 name     | character varying(255) | not null                                              | extended |              | 
 password | character varying(255) | not null                                              | extended |              | 
Indexes:
    "user_pkey" PRIMARY KEY, btree (id)

fg=# 
