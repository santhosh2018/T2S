'use strict';

global.approot = require('app-root-path');
if (process.env.NODE_ENV === undefined) process.env.NODE_ENV = 'development';
const config = require('config');
const appConfig = config.get('app');
const users = config.get('users');
const swaggerConfig = config.get('swagger');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const router = express.Router();
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const passportJWT = require('passport-jwt');
const bcrypt = require('bcryptjs');

const ExtractJwt = passportJWT.ExtractJwt;
const JwtStrategy = passportJWT.Strategy;

const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = 'thisisfortestingpurpose';

const searchIndex = function (data, key, value) {
  for (let i = 0 ;i < data.length;  i++) {
    if (data[i][key] === value) {
      return i;
    }
  }
  return -1;
};


const strategy = new JwtStrategy(jwtOptions, function(payload, next) {
  // usually this would be a database call:
  const user = users[searchIndex(users, 'id', payload.id)];

  if (user) {
    next(null, user);
  }
  else {
    next(null, false);
  }
});

passport.use(strategy);


app.use('/api', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  next();
});

app.use(passport.initialize());

const swaggerDefinition = {
  swagger: swaggerConfig.version,
  info: {
    title: 'API Evaluation by T2S',
    version: '1.0.0,',
    description: 'API Evaluation by T2S',
  },
  securityDefinitions: {
        jwt: {
            type: 'apiKey',
            'in': 'header',
            name: 'Authorization',
        },
  },
  security: [
        {
            jwt: [],
        },
  ],
  basePath: swaggerConfig.basePath,
  schemes: [
    swaggerConfig.scheme,
  ],
};

const options = {
  swaggerDefinition: swaggerDefinition,
  apis: [ './app/routes/*.js', './app/models/*.js'  ],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.use(bodyParser.json());
app.use(bodyParser.text());

fs.readdirSync('./app/routes').forEach( (file) => {
  if (file.substr(-3) === '.js') {
    const { routes } = require(approot + '/app/routes/' + file);
    routes(router);
  }
});

app.use('/api', router);

app.post('/login', function(req, res) {
  if (req.body.name && req.body.password){
    const user = users[searchIndex(users, 'name', req.body.name)];

    if ( !user ){
      res.status(404).json({ message: 'no such a user found' });
    }

    if (bcrypt.compareSync(req.body.password, user.password)) {
      const token = jwt.sign({ id: user.id }, jwtOptions.secretOrKey);
      res.json({ message: 'successfully authenticated!', token: 'JWT ' + token });
    }
    else {
      res.status(404).json({ message: 'password did not match' });
    }
  }
  else {
    res.status(404).json({ message: 'enter username & password to valiate' });
  }


});

app.listen(appConfig.port, () => {
  console.log('listening on ' + appConfig.port);
});


module.exports = app;
