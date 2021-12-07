import { Knex } from 'knex';
import {
    CREATE_ENHANCED_LOCATION_VIEW,
    CREATE_ENHANCED_RESIDENCE_VIEW,
    DROP_ON_UPDATE_TIMESTAMP_FUNCTION,
    onUpdateTrigger,
    ON_UPDATE_TIMESTAMP_FUNCTION,
} from '../raw_sql';

export async function up(knex: Knex): Promise<void> {
    // function to execute trigger
    await knex.raw(ON_UPDATE_TIMESTAMP_FUNCTION);

    await knex.schema
        .createTable('users', (table: Knex.TableBuilder) => {
            table.increments('user_id');
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
            table.specificType('geog', 'geography(point, 4326)').notNullable();
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
            table
                .integer('res_id')
                .references('res_id')
                .inTable('residences')
                .notNullable();
            table
                .integer('user_id')
                .references('user_id')
                .inTable('users')
                .notNullable();
            table.unique(['user_id', 'res_id']);
            table.integer('rent');
            table.integer('rating');
            table.specificType('lease_term', 'tsrange').notNullable();
            table.text('feedback');
            table.specificType('red_flags', 'TEXT[]');
            table.specificType('green_flags', 'TEXT[]');
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .then(() => knex.raw(onUpdateTrigger('reviews')));

    await knex.schema
        .createTable('saved_residences', (table: Knex.TableBuilder) => {
            table
                .integer('res_id')
                .references('res_id')
                .inTable('residences')
                .notNullable();
            table
                .integer('user_id')
                .references('user_id')
                .inTable('users')
                .notNullable();
            table.unique(['user_id', 'res_id']);
            table.timestamp('created_at').defaultTo(knex.fn.now());
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .then(() => knex.raw(onUpdateTrigger('saved_residences')));

    // View to enhance residences with average_stats
    await knex.schema.createView('residences_enhanced', (view) => {
        view.columns([
            'res_id',
            'loc_id',
            'unit',
            'created_at',
            'updated_at',
            'avg_rating',
            'avg_rent',
        ]);
        view.as(CREATE_ENHANCED_RESIDENCE_VIEW(knex));
    });

    // View to enhance locations with their coords and average stats
    await knex.schema.createView('locations_enhanced', (view) => {
        view.columns([
            'loc_id',
            'google_place_id',
            'formatted_address',
            'category',
            'landlord_email',
            'geog',
            'lat',
            'lng',
            'created_at',
            'updated_at',
        ]);
        view.as(CREATE_ENHANCED_LOCATION_VIEW(knex));
    });
}

export async function down(knex: Knex): Promise<void> {
    // views
    await knex.schema.dropViewIfExists('locations_enhanced');
    await knex.schema.dropViewIfExists('residences_enhanced');
    // tables
    await knex.schema.dropTable('flags');
    await knex.schema.dropTable('reviews');
    await knex.schema.dropTable('saved_residences');
    await knex.schema.dropTable('users');
    await knex.schema.dropTable('residences');
    await knex.schema.dropTable('locations');
    // functions
    await knex.raw(DROP_ON_UPDATE_TIMESTAMP_FUNCTION);
}
