import { Migration } from '@mikro-orm/migrations';

export class Migration20220125000036 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "place_notify_on_review" ("place_id" uuid not null, "imho_user_id" uuid not null);');
    this.addSql('alter table "place_notify_on_review" add constraint "place_notify_on_review_pkey" primary key ("place_id", "imho_user_id");');

    this.addSql('alter table "place_notify_on_review" add constraint "place_notify_on_review_place_id_foreign" foreign key ("place_id") references "place" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "place_notify_on_review" add constraint "place_notify_on_review_imho_user_id_foreign" foreign key ("imho_user_id") references "imho_user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "review" add constraint "review_author_id_residence_id_unique" unique ("author_id", "residence_id");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "place_notify_on_review" cascade;');

    this.addSql('alter table "review" drop constraint "review_author_id_residence_id_unique";');
  }

}
