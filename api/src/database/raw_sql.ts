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
