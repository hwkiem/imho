import { Migration } from '@mikro-orm/migrations';

export class Migration20220331013748 extends Migration {
    async up(): Promise<void> {
        this.addSql('alter table "review" add column "flags" jsonb null;');

        this.addSql('alter table "review" drop column "flag_string";');
    }

    async down(): Promise<void> {
        this.addSql(
            'alter table "review" add column "flag_string" varchar not null default null;'
        );
        this.addSql('alter table "review" drop column "flags";');
    }
}
