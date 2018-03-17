'use strict';

/* global schemaName */
exports.up = (knex) => {
  return knex.schema.createTable(`${schemaName}.customer`, t => {
    t.increments('id').unsigned()
      .primary();
    t.string('first_name').notNull();
    t.string('last_name').notNull();
    t.string('phone').notNull();
    t.string('email').notNull();
    t.integer('store_id').unsigned()
      .references('id')
      .inTable(`${schemaName}.store`);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(`${schemaName}.customer`);
};
