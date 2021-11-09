import { Knex } from 'knex';
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
            table.string('formatted_address');
            table.string('landlord_email');
            table.enum('category', ['HOUSE', 'APARTMENT']).notNullable();
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
            table.increments('rev_id');
            table.integer('res_id').references('res_id').inTable('residences');
            table.integer('user_id').references('user_id').inTable('users');
            table.unique(['user_id', 'res_id']);
            table.integer('rent');
            table.integer('rating');
            table.specificType('lease_term', 'tsrange');
            table.text('feedback');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .then(() => knex.raw(onUpdateTrigger('reviews')));

    await knex.schema
        .createTable('flags', (table: Knex.TableBuilder) => {
            table.increments('flag_id');
            table
                .integer('rev_id')
                .references('rev_id')
                .inTable('reviews')
                .notNullable();
            table.enum('category', ['RED', 'GREEN']).notNullable();
            table.string('topic');
            table.integer('intensity');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .then(() => knex.raw(onUpdateTrigger('flags')));

    // View to enhance residences with average_stats
    await knex.raw(CREATE_ENHANCED_RESIDENCE_VIEW(knex));

    // View to enhance locations with their coords and average stats
    await knex.raw(CREATE_ENHANCED_LOCATION_VIEW(knex));
}

export async function down(knex: Knex): Promise<void> {
    await knex.raw(DROP_ENHANCED_LOC_VIEW);
    await knex.raw(DROP_ENHANCED_RES_VIEW);
    await knex.schema.dropTable('flags');
    await knex.schema.dropTable('reviews');
    await knex.schema.dropTable('users');
    await knex.schema.dropTable('residences');
    await knex.schema.dropTable('locations');
    await knex.raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION);
}
