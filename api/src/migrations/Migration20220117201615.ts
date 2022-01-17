import { Migration } from '@mikro-orm/migrations';

export class Migration20220117201615 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "review" drop constraint if exists "review_flag_string_check";');
    this.addSql('alter table "review" alter column "flag_string" type text[] using ("flag_string"::text[]);');
  }

}
