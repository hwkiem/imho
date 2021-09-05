import * as Knex from 'knex';
import {
    DROP_ON_UPDATE_TIMESTAMP_FUNCTION,
    onUpdateTrigger,
    ON_UPDATE_TIMESTAMP_FUNCTION,
} from '../raw_sql';

export async function up(knex: Knex): Promise<void> {
    // function to execute trigger
    await knex.raw(ON_UPDATE_TIMESTAMP_FUNCTION);

    await knex.schema
        .createTable('users', (table: Knex.TableBuilder) => {
            table.increments('user_id').primary();
            table.string('first_name');
            table.string('last_name');
            table.string('email').unique();
            table.string('password');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .then(() => knex.raw(onUpdateTrigger('users')));

    await knex.schema
        .createTable('residences', (table: Knex.TableBuilder) => {
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
        })
        .then(() => knex.raw(onUpdateTrigger('residences')));

    await knex.schema
        .createTable('reviews', (table: Knex.TableBuilder) => {
            table.integer('res_id').references('res_id').inTable('residences');
            table.integer('user_id').references('user_id').inTable('users');
            table.unique(['user_id', 'res_id'], 'userResTuple');
            table.float('rating');
            table.integer('rent');
            // new
            table.boolean('air_conditioning');
            table.boolean('heat');
            table.boolean('pool');
            table.boolean('gym');
            table.boolean('garbage_disposal');
            table.boolean('dishwasher');
            table.boolean('parking');
            table.boolean('doorman');
            table.boolean('pet_friendly');
            table.boolean('backyard');
            table.integer('bedroom_count');
            table.float('bath_count');
            table.integer('recommend_score');
            table.specificType('lease_term_', 'tsrange');
            table.enum('stove', ['GAS', 'ELECTRIC']);
            table.enum('laundry', ['IN_UNIT', 'BUILDING', 'NONE']);

            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .then(() => knex.raw(onUpdateTrigger('reviews')));
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('reviews');
    await knex.schema.dropTable('users');
    await knex.schema.dropTable('residences');
    await knex.raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION);
}
