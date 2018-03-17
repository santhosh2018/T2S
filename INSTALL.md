1.Go to your project directory
cd T2S

2.Install yarn & modules
npm install -y yarn
npm install

3. DB configuration and password hashing required users.

- config your DB instance after made your PostgreSQL DB setup.
- Store your username and password in the default.js file as it's not maintained DB for now. (Yet to implement signup/logout service)
- follow this way to hash your password

ATH017571:T2S ssanthoshkumar$ node
> const bcrypt = require('bcryptjs');
undefined
> const salt = bcrypt.genSaltSync();
undefined
>
>  const hash = bcrypt.hashSync('test',salt);
undefined
> hash
'$2a$10$V6NlO.qWBwR1sLWReuZe9OQT3Fx1xhG04FF7pbeFVW/H698h4zgSe' 

santhosh@2d4b668da454:~/src/config$ cat default.js 
'use strict';

module.exports = {
  app: {
    name: 'T2S',
    env: process.env.NODE_ENV || 'development',
    port: process.env.APP_PORT || 3000,
  },
  rdbms: {
    client: 'pg',
    connection: {
      host: process.env.PG_HOST || 'postgres',
      port: process.env.PG_PORT || 5432,
      database: process.env.PG_DB || 'fg',
      user: process.env.PG_USER || 'fg',
      password: process.env.PG_PWD || 'fgpass',
    },
  },
  swagger: {
    version: '2.0',
    basePath: '/api',
    scheme: 'http',
  },
  users: [
  {
    id: 1,
    name: 'santhosh',
    password: '$2a$10$V6NlO.qWBwR1sLWReuZe9Os4Ur9TBgIjDu14IMleSUhn4DXvvfXnG',
  },
  {
    id: 2,
    name: 'test',
    password: '$2a$10$V6NlO.qWBwR1sLWReuZe9OQT3Fx1xhG04FF7pbeFVW/H698h4zgSe',
  },
  ],
};
santhosh@2d4b668da454:~/src/config$ 

** NEED few re-work if you are going to use ORACLE.


4. Port all the tables into schema.

- Port your Database tables and create required data via API. (Seed run is not implemented)
- Create your development schema also if needed.  

santhosh@2d4b668da454:~/src$ node bin/knex-run -s testing migrate:latest
Running against SCHEMA=testing
Batch 1 run: 3 migrations 
/home/santhosh/src/db/migrations/schema/20180315100000-store.js
/home/santhosh/src/db/migrations/schema/20180315200000-customer.js
/home/santhosh/src/db/migrations/schema/20180315300000-user.js

- In case if you expect to rollback all tables.

santhosh@2d4b668da454:~/src$ node bin/knex-run -s testing migrate:rollback
Running against SCHEMA=testing
Batch 1 rolled back: 3 migrations 
/home/santhosh/src/db/migrations/schema/20180315300000-user.js
/home/santhosh/src/db/migrations/schema/20180315200000-customer.js
/home/santhosh/src/db/migrations/schema/20180315100000-store.js

5. Run unit test

- Run unit test ( yet to implement functional test)

santhosh@2d4b668da454:~/src$ yarn test
yarn test v0.27.5
$ mocha


  controllers/customers
    GET customers
      ✓ responds correctly when multiple customers found
      ✓ calls findById with ID in the params
      ✓ calls without ID in the params
      ✓ responds correctly with no feature found
    POST customer
      ✓ calls create method with a correctly constructed customer
      ✓ calls create method - mandatory fields check

  controllers/stores
    GET stores
      ✓ responds correctly when multiple stores found
      ✓ calls findById with ID in the params
      ✓ calls without ID in the params
      ✓ responds correctly with no store found
    POST/PUT store
      ✓ calls create method with a correctly constructed store
      ✓ calls create method - mandatory fields check
      ✓ calls update method with a correctly constructed store

  models/customer
    getter fields
      ✓ adds specific fields
    tableName getter function
      ✓ sets table name to customer

  models/store
    getter fields
      ✓ adds specific fields
    tableName getter function
      ✓ sets table name to store


  17 passing (67ms)

Done in 2.35s.
santhosh@2d4b668da454:~/src$ 

6. Start the application 

:$> yarn apistart

fgdev@2d4b668da454:~/src$ yarn apistart 
yarn apistart v0.27.5
$ nodemon app.js
[nodemon] 1.17.2
[nodemon] to restart at any time, enter `rs`
[nodemon] watching: *.*
[nodemon] starting `node app.js`
listening on 3000

you will be able to see above logs.


7. Verify.

- Make sure that server is up and running, able to see swagger documentation and Postgres connectivity.

http://localhost:3000/api-docs/

Refer postman directory or README.md to refer detail test plan.
