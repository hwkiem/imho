export const ON_UPDATE_TIMESTAMP_FUNCTION = `
    CREATE OR REPLACE FUNCTION on_update_timestamp()
    RETURNS TRIGGER
    LANGUAGE plpgsql AS
        $$ BEGIN
        NEW.updated_at := current_timestamp;
        RETURN NEW;
        END; $$;
    `;

export const DROP_RES_AVERAGES = `DROP VIEW IF EXISTS res_averages`;

export const DROP_ON_UPDATE_TIMESTAMP_FUNCTION = `DROP FUNCTION on_update_timestamp`;

export const onUpdateTrigger = (table: string): string => {
    return `CREATE TRIGGER ${table}_updated_at
    BEFORE UPDATE ON ${table}
    FOR EACH ROW
    EXECUTE PROCEDURE on_update_timestamp();
    `;
};

export const CREATE_RES_AVERAGES = `
    CREATE OR REPLACE VIEW res_averages (
        res_id, avg_rent, avg_rating
        ) as
         SELECT residences.res_id, avg(reviews.rent), avg(reviews.rating) 
         FROM residences left outer join reviews ON 
            reviews.res_id = residences.res_id group by residences.res_id`;
