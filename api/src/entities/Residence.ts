import {
    Cascade,
    Collection,
    Entity,
    ManyToOne,
    OneToMany,
    Property,
    Unique,
} from '@mikro-orm/core';
import { Review } from './Review';
import { Ctx, Field, Float, ObjectType, Root } from 'type-graphql';
import { Base } from './Base';
import { ResidenceValidator } from '../validators/ResidenceValidator';
import { Place } from './Place';
import { MyContext } from '../utils/context';
import { EntityManager } from '@mikro-orm/postgresql';

export const SINGLE_FAMILY = 'single family';

@ObjectType()
@Entity()
@Unique({ properties: ['unit', 'place'] })
export class Residence extends Base<Residence> {
    @OneToMany(() => Review, (r: Review) => r.residence)
    public reviewCollection = new Collection<Review>(this);

    /**
     * Reviews written about this residence
     */
    @Field(() => [Review])
    async reviews(
        @Root() residence: Residence
    ): Promise<Collection<Review> | null> {
        if (!residence.reviewCollection.isInitialized()) {
            await residence.reviewCollection.init();
        }
        return residence.reviewCollection;
    }

    @ManyToOne(() => Place, {
        cascade: [Cascade.PERSIST, Cascade.REMOVE],
    })
    public place: Place;

    /**
     * The place where this residence exists
     */
    @Field(() => Place)
    async myPlace(@Root() residence: Residence): Promise<Place | null> {
        if (!residence.place.isInitialized()) {
            await residence.place.init();
        }
        return residence.place;
    }

    /* Properties */
    @Field()
    @Property({ default: SINGLE_FAMILY })
    public unit: string;

    /* Averages and stats across reviews */
    @Field(() => Float, { nullable: true })
    async averageRating(
        @Root() residence: Residence,
        @Ctx() { em }: MyContext
    ): Promise<number | null> {
        const knex = (em as EntityManager).getConnection().getKnex();

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
