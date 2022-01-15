import { Knex } from 'knex';
import KnexPostgis from 'knex-postgis';
import { Residence } from '../Residence/Residence';
export const ON_UPDATE_TIMESTAMP_FUNCTION = `
    CREATE OR REPLACE FUNCTION on_update_timestamp()
    RETURNS TRIGGER
    LANGUAGE plpgsql AS
        $$ BEGIN
        NEW.updated_at := current_timestamp;
        RETURN NEW;
        END; $$;
    `;

export const DROP_ON_UPDATE_TIMESTAMP_FUNCTION = `DROP FUNCTION on_update_timestamp`;

export const onUpdateTrigger = (table: string): string => {
    return `CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
    `;
};

export const CREATE_ENHANCED_RESIDENCE_VIEW = (knex: Knex) => {
    const sub = knex('residences')
        .select([
            'residences.res_id',
            // knex.avg('reviews.rent').as('avg_rent'), // does this work? should
            knex.avg('reviews.rating').as('avg_rating'),
            // knex.raw('avg(reviews.rent) as avg_rent'),
            // knex.raw('avg(reviews.rating) as avg_rating'),
        ])
        .leftOuterJoin('reviews', 'reviews.res_id', 'residences.res_id')
        .groupBy('residences.res_id')
        .as('aggs');
    const viewDefinition = knex<Residence>('residences')
        .select([
            'residences.res_id',
            'loc_id',
            'unit',
            'residences.created_at',
            'residences.updated_at',
            'avg_rating',
            // 'avg_rent',
        ])
        .join(sub, 'aggs.res_id', 'residences.res_id');

    return viewDefinition;
};

const loc_avg = (s: string, knex: Knex) => {
    const identifier = knex.ref('locations.loc_id');
    return knex('residences_enhanced')
        .avg(s)
        .where('residences_enhanced.loc_id', identifier)
        .as(s);
};

// NOTE
// any aggregate available to a location must already be available on a residence
// this queries residences_enhanced
export const CREATE_ENHANCED_LOCATION_VIEW = (knex: Knex) => {
    const knexPostgis: KnexPostgis.KnexPostgis = KnexPostgis(knex);
    const viewDefinition = knex('locations').select([
        [
            'loc_id',
            'google_place_id',
            'formatted_address',
            'category',
            'landlord_email',
            'geog',
            knexPostgis.x(knexPostgis.geometry('geog')),
            knexPostgis.y(knexPostgis.geometry('geog')),
            'created_at',
            'updated_at',
        ],
        // loc_avg('avg_rent', knex),
        loc_avg('avg_rating', knex),
    ]);

    return viewDefinition;
};
