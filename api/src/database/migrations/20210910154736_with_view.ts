import * as Knex from 'knex';
import {
    CREATE_ENHANCED_LOCATION_VIEW,
    CREATE_ENHANCED_RESIDENCE_VIEW,
    DROP_ENHANCED_LOC_VIEW,
    DROP_ENHANCED_RES_VIEW,
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
        .createTable('locations', (table: Knex.TableBuilder) => {
            table.increments('loc_id');
            table.string('google_place_id').unique();
            table.string('full_address');
            table.string('street_num');
            table.string('route');
            table.string('city');
            table.string('state');
            table.string('postal_code');
            table.specificType('geog', 'geography(point, 4326)');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .then(() => knex.raw(onUpdateTrigger('locations')));

    await knex.schema
        .createTable('residences', (table: Knex.TableBuilder) => {
            table.increments('res_id');
            table
                .integer('loc_id')
                .references('loc_id')
                .inTable('locations')
                .notNullable();
            table.string('unit').notNullable();
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
            table.unique(['loc_id', 'unit']);
        })
        .then(() => knex.raw(onUpdateTrigger('residences')));

    await knex.schema
        .createTable('reviews', (table: Knex.TableBuilder) => {
            table.integer('res_id').references('res_id').inTable('residences');
            table.integer('user_id').references('user_id').inTable('users');
            table.unique(['user_id', 'res_id'], 'userResTuple');
            table.integer('rent');
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
            table.integer('rating');
            table.specificType('lease_term', 'tsrange');
            table.enum('stove', ['GAS', 'ELECTRIC']);
            table.enum('laundry', ['IN_UNIT', 'BUILDING', 'NONE']);

            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .then(() => knex.raw(onUpdateTrigger('reviews')));

    // View to enhance residences with average_stats
    await knex.raw(CREATE_ENHANCED_RESIDENCE_VIEW(knex));

    // View to enhance locations with their coords and average stats
    await knex.raw(CREATE_ENHANCED_LOCATION_VIEW(knex));
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw(DROP_ENHANCED_LOC_VIEW);
    await knex.raw(DROP_ENHANCED_RES_VIEW);
    await knex.schema.dropTable('reviews');
    await knex.schema.dropTable('users');
    await knex.schema.dropTable('residences');
    await knex.schema.dropTable('locations');
    await knex.raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION);
}
