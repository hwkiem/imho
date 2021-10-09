import * as Knex from 'knex';
import { Residence } from '../Residence/Residence';
import { locationColumns, residenceColumns } from '../utils/db_helper';
export const ON_UPDATE_TIMESTAMP_FUNCTION = `
    CREATE OR REPLACE FUNCTION on_update_timestamp()
    RETURNS TRIGGER
    LANGUAGE plpgsql AS
        $$ BEGIN
        NEW.updated_at := current_timestamp;
        RETURN NEW;
        END; $$;
    `;

export const DROP_ENHANCED_RES_VIEW = `DROP VIEW IF EXISTS residences_enhanced`;
export const DROP_ENHANCED_LOC_VIEW = `DROP VIEW IF EXISTS locations_enhanced`;

export const DROP_ON_UPDATE_TIMESTAMP_FUNCTION = `DROP FUNCTION on_update_timestamp`;

export const onUpdateTrigger = (table: string): string => {
    return `CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
    `;
};

const mode = (s: string, knex: Knex) => {
    return knex.raw(`mode() WITHIN GROUP (order by ${s}) as ${s}`);
};

export const CREATE_ENHANCED_RESIDENCE_VIEW = (knex: Knex): string => {
    const sub = knex('residences')
        .select([
            'residences.res_id',
            knex.raw('avg(reviews.rent) as avg_rent'),
            knex.raw('avg(reviews.rating) as avg_rating'),
            mode('air_conditioning', knex),
            mode('heat', knex),
            mode('stove', knex),
            mode('pool', knex),
            mode('gym', knex),
            mode('garbage_disposal', knex),
            mode('dishwasher', knex),
            mode('parking', knex),
            mode('doorman', knex),
            mode('pet_friendly', knex),
            mode('laundry', knex),
            mode('backyard', knex),
            mode('bath_count', knex),
            mode('bedroom_count', knex),
        ])
        .leftOuterJoin('reviews', 'reviews.res_id', 'residences.res_id')
        .groupBy('residences.res_id')
        .as('aggs');
    const viewDefinition = knex<Residence>('residences')
        .select(residenceColumns())
        .join(sub, 'aggs.res_id', 'residences.res_id');

    return `CREATE OR REPLACE VIEW residences_enhanced AS (\n ${viewDefinition})`;
};

const loc_avg = (s: string, knex: Knex) => {
    const identifier = knex.ref('locations.loc_id');
    return knex('residences_enhanced')
        .avg(s)
        .where('residences_enhanced.loc_id', identifier)
        .as(s);
};

const loc_mode = (s: string, knex: Knex) => {
    return knex.raw(
        `(SELECT mode() WITHIN GROUP (order by ${s}) from residences_enhanced where locations.loc_id = residences_enhanced.loc_id) as ${s}`
    );
};

// NOTE
// any mode aggregate available to a location must already be available on a residence
// this queries residences_enhanced
export const CREATE_ENHANCED_LOCATION_VIEW = (knex: Knex): string => {
    const viewDefinition = knex('locations').select([
        ...locationColumns(),
        loc_avg('avg_rent', knex),
        loc_avg('avg_rating', knex),
        loc_mode('air_conditioning', knex),
        loc_mode('heat', knex),
        loc_mode('stove', knex),
        loc_mode('pool', knex),
        loc_mode('gym', knex),
        loc_mode('garbage_disposal', knex),
        loc_mode('dishwasher', knex),
        loc_mode('parking', knex),
        loc_mode('doorman', knex),
        loc_mode('pet_friendly', knex),
        loc_mode('laundry', knex),
        loc_mode('backyard', knex),
        loc_mode('bath_count', knex),
        loc_mode('bedroom_count', knex),
    ]);

    return `CREATE OR REPLACE VIEW locations_enhanced AS (\n ${viewDefinition})`;
};
