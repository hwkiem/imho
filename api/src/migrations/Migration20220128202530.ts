import { Migration } from '@mikro-orm/migrations';

export class Migration20220128202530 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "residence" drop constraint if exists "residence_unit_check";');
    this.addSql('alter table "residence" alter column "unit" type varchar(255) using ("unit"::varchar(255));');
    this.addSql('alter table "residence" alter column "unit" set default \'single family\';');
    this.addSql('alter table "residence" add constraint "residence_place_id_unit_unique" unique ("place_id", "unit");');
  }

  async down(): Promise<void> {
    this.addSql('alter table "residence" drop constraint if exists "residence_unit_check";');
    this.addSql('alter table "residence" alter column "unit" type varchar(255) using ("unit"::varchar(255));');
    this.addSql('alter table "residence" alter column "unit" set default \'single\';');
    this.addSql('alter table "residence" drop constraint "residence_place_id_unit_unique";');
  }

}
