import { Migration } from '@mikro-orm/migrations';

export class Migration20220127005934 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "residence" drop constraint if exists "residence_unit_check";');
    this.addSql('alter table "residence" alter column "unit" type varchar(255) using ("unit"::varchar(255));');
    this.addSql('alter table "residence" alter column "unit" set default \'single family\';');
  }

  async down(): Promise<void> {
    this.addSql('alter table "residence" drop constraint if exists "residence_unit_check";');
    this.addSql('alter table "residence" alter column "unit" type varchar(255) using ("unit"::varchar(255));');
    this.addSql('alter table "residence" alter column "unit" set default \'single\';');
  }

}
