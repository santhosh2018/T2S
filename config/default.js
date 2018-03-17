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
