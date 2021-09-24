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

export const CREATE_ENHANCED_RESIDENCE_VIEW = (knex: Knex): string => {
    const sub = knex('residences')
        .select([
            'residences.res_id',
            knex.raw('avg(reviews.rent) as avg_rent'),
            knex.raw('avg(reviews.rating) as avg_rating'),
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

export const CREATE_ENHANCED_LOCATION_VIEW = (knex: Knex): string => {
    const viewDefinition = knex('locations').select([
        ...locationColumns(),
        loc_avg('avg_rent', knex),
        loc_avg('avg_rating', knex),
    ]);
    // console.log(
    //     `CREATE OR REPLACE VIEW locations_enhanced AS (\n ${viewDefinition})`
    // );
    return `CREATE OR REPLACE VIEW locations_enhanced AS (\n ${viewDefinition})`;
};
