'use strict';

/* global schemaName */
exports.up = (knex) => {
  return knex.schema.createTable(`${schemaName}.user`, t => {
    t.increments('id').unsigned()
      .primary();
    t.string('name').notNull();
    t.string('password').notNull();
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(`${schemaName}.user`);
};
