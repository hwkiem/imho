import { Migration } from '@mikro-orm/migrations';

export class Migration20220123215145 extends Migration {
    async up(): Promise<void> {
        this.addSql(
            'create table "imho_user" ("id" uuid not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "email" varchar(255) not null, "password" varchar(255) null, "is_activated" boolean not null);'
        );
        this.addSql(
            'alter table "imho_user" add constraint "imho_user_email_unique" unique ("email");'
        );
        this.addSql(
            'alter table "imho_user" add constraint "imho_user_pkey" primary key ("id");'
        );

        this.addSql(
            'alter table "place" add constraint "place_google_place_id_unique" unique ("google_place_id");'
        );

        this.addSql('alter table "review" add column "author_id" uuid null;');
        this.addSql(
            'alter table "review" drop constraint if exists "review_feedback_check";'
        );
        this.addSql(
            'alter table "review" alter column "feedback" type varchar(255) using ("feedback"::varchar(255));'
        );
        this.addSql(
            'alter table "review" alter column "feedback" drop not null;'
        );
        this.addSql(
            'alter table "review" add constraint "review_author_id_foreign" foreign key ("author_id") references "imho_user" ("id") on update cascade on delete set null;'
        );
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table "review" drop constraint "review_author_id_foreign";'
        );

        this.addSql('drop table if exists "imho_user" cascade;');

        this.addSql(
            'alter table "place" drop constraint "place_google_place_id_unique";'
        );

        this.addSql(
            'alter table "review" drop constraint if exists "review_feedback_check";'
        );
        this.addSql(
            'alter table "review" alter column "feedback" type varchar using ("feedback"::varchar);'
        );
        this.addSql(
            'alter table "review" alter column "feedback" set not null;'
        );
        this.addSql('alter table "review" drop column "author_id";');
    }
}
