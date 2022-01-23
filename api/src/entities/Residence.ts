import {
    Cascade,
    Collection,
    Entity,
    ManyToOne,
    OneToMany,
    Property,
} from '@mikro-orm/core';
import { Review } from './Review';
import { Ctx, Field, Float, ObjectType, Root } from 'type-graphql';
import { Base } from './Base';
import { ResidenceValidator } from '../validators/ResidenceValidator';
import { Place } from './Place';
import { MyContext } from '../utils/context';
import { EntityManager, PostgreSqlConnection } from '@mikro-orm/postgresql';

@ObjectType()
@Entity()
export class Residence extends Base<Residence> {
    @OneToMany(() => Review, (r: Review) => r.residence)
    public reviewCollection = new Collection<Review>(this);

    @Field({ defaultValue: 'single', nullable: true })
    @Property({ default: 'single' })
    public unit: string;

    @Field(() => [Review])
    async reviews(
        @Root() residence: Residence
    ): Promise<Collection<Review> | null> {
        if (residence.reviewCollection.isInitialized()) {
            return residence.reviewCollection;
        } else {
            await residence.reviewCollection.init();
            return residence.reviewCollection;
        }
    }

    @Field(() => Place)
    @ManyToOne(() => Place, {
        cascade: [Cascade.PERSIST, Cascade.REMOVE],
    })
    public place: Place;

    @Field(() => Float, { nullable: true })
    async averageRating(
        @Root() residence: Residence,
        @Ctx() { em }: MyContext
    ): Promise<number | null> {
        const knex = (
            (em as EntityManager).getConnection() as PostgreSqlConnection
        ).getKnex();

        const res = await knex
            .avg('rating')
            .from('review')
            .where('review.residence_id', '=', residence.id);

        if (!res[0].avg) return null;
        return +res[0].avg;
    }

    constructor(body: ResidenceValidator) {
        super(body);
    }
}
