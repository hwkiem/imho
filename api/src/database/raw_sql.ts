import * as Knex from 'knex';
import { Residence } from '../Residence/residence';
import { residenceColumns } from '../utils/db_helper';
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
