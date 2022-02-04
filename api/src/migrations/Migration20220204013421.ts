import { Migration } from '@mikro-orm/migrations';

export class Migration20220204013421 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "place" drop column "type";');

        this.addSql(
            'alter table "residence" drop constraint if exists "residence_unit_check";'
        );
        this.addSql(
            'alter table "residence" alter column "unit" type varchar(255) using ("unit"::varchar(255));'
        );
        this.addSql(
            'alter table "residence" alter column "unit" set default \'single family\';'
        );
        this.addSql(
            'alter table "residence" add constraint "residence_unit_place_id_unique" unique ("unit", "place_id");'
        );
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table "place" add column "type" text check ("type" in (\'single family\', \'multi unit\')) not null;'
        );

        this.addSql(
            'alter table "residence" drop constraint if exists "residence_unit_check";'
        );
        this.addSql(
            'alter table "residence" alter column "unit" type varchar(255) using ("unit"::varchar(255));'
        );
        this.addSql(
            'alter table "residence" alter column "unit" set default \'single\';'
        );
        this.addSql(
            'alter table "residence" drop constraint "residence_unit_place_id_unique";'
        );
    }
}
