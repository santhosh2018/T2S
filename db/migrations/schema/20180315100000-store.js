'use strict';

/* global schemaName */
exports.up = (knex) => {
  return knex.schema.createTable(`${schemaName}.store`, t => {
    t.increments('id').unsigned()
      .primary();
    t.string('name').unique()
      .notNull();
    t.string('phone').notNull();
    t.string('domain').notNull();
    t.string('street').notNull();
    t.string('state').notNull();
    t.string('status');
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(`${schemaName}.store`);
};
