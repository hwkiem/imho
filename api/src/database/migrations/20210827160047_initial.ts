import * as Knex from 'knex';

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('users', (table: Knex.TableBuilder) => {
        table.increments('user_id').primary();
        table.string('first_name');
        table.string('last_name');
        table.string('email').unique();
        table.string('password');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('residences', (table: Knex.TableBuilder) => {
        table.increments('res_id');
        table.string('google_place_id').unique();
        table.string('full_address');
        table.string('apt_num').nullable();
        table.string('street_num');
        table.string('route');
        table.string('city');
        table.string('state');
        table.string('postal_code');
        table.specificType('geog', 'geography(point, 4326)');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });

    await knex.schema.createTable('reviews', (table: Knex.TableBuilder) => {
        table.integer('res_id').references('res_id').inTable('residences');
        table.integer('user_id').references('user_id').inTable('users');
        table.unique(['user_id', 'res_id'], 'userResTuple');
        table.integer('rating');
        table.integer('rent');
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('reviews');
    await knex.schema.dropTable('users');
    await knex.schema.dropTable('residences');
}
