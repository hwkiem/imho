import { Migration } from '@mikro-orm/migrations';

export class Migration20220120172157 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "place" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "google_place_id" varchar(255) not null, "formatted_address" varchar(255) not null, "type" text check ("type" in (\'single family\', \'multi unit\')) not null);');
    this.addSql('alter table "place" add constraint "place_pkey" primary key ("id");');

    this.addSql('create table "residence" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "unit" varchar(255) not null default \'single\', "place_id" uuid null);');
    this.addSql('alter table "residence" add constraint "residence_pkey" primary key ("id");');

    this.addSql('create table "review" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "feedback" varchar(255) not null, "rating" int not null, "residence_id" uuid null, "flag_string" varchar(255) not null);');
    this.addSql('alter table "review" add constraint "review_pkey" primary key ("id");');

    this.addSql('alter table "residence" add constraint "residence_place_id_foreign" foreign key ("place_id") references "place" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "review" add constraint "review_residence_id_foreign" foreign key ("residence_id") references "residence" ("id") on update cascade on delete cascade;');
  }

}
