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
import { Arg, Ctx, Field, Float, Int, ObjectType, Root } from 'type-graphql';
import { Base } from './Base';
import { ResidenceValidator } from '../validators/ResidenceValidator';
import { Place } from './Place';
import { MyContext } from '../utils/context';
import { EntityManager } from '@mikro-orm/postgresql';
import { TopNFlagsResponse } from '../utils/types/Flag';
import { AllConFlags, AllProFlags } from '../utils/enums/FlagType.enum';

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

    @Field(() => TopNFlagsResponse, { nullable: true })
    async topNFlags(
        @Root() residence: Residence,
        @Arg('n', () => Int, { nullable: true }) n?: number | undefined
    ): Promise<TopNFlagsResponse | undefined> {
        const reviewsRef = await this.reviews(residence);
        if (reviewsRef === null) return;
        const reviews = await reviewsRef.loadItems();
        const counter = {
            pros: {} as { [key in AllProFlags]: number },
            cons: {} as { [key in AllConFlags]: number },
        };

        reviews.forEach((review: Review) => {
            const flags = review.flags(review);
            if (flags === undefined) return;
            // all pros
            if (flags.pros.misc) {
                flags.pros.misc.forEach((f) => {
                    counter.pros[f] = counter.pros[f] ? ++counter.pros[f] : 1;
                });
            }
            if (flags.pros.bathroom) {
                flags.pros.bathroom.forEach((f) => {
                    counter.pros[f] = counter.pros[f] ? ++counter.pros[f] : 1;
                });
            }
            if (flags.pros.kitchen) {
                flags.pros.kitchen.forEach((f) => {
                    counter.pros[f] = counter.pros[f] ? ++counter.pros[f] : 1;
                });
            }
            if (flags.pros.location) {
                flags.pros.location.forEach((f) => {
                    counter.pros[f] = counter.pros[f] ? ++counter.pros[f] : 1;
                });
            }
            if (flags.pros.landlord) {
                flags.pros.landlord.forEach((f) => {
                    counter.pros[f] = counter.pros[f] ? ++counter.pros[f] : 1;
                });
            }
            // all cons
            if (flags.cons.misc) {
                flags.cons.misc.forEach((f) => {
                    counter.cons[f] = counter.cons[f] ? ++counter.cons[f] : 1;
                });
            }
            if (flags.cons.bathroom) {
                flags.cons.bathroom.forEach((f) => {
                    counter.cons[f] = counter.cons[f] ? ++counter.cons[f] : 1;
                });
            }
            if (flags.cons.maintenance) {
                flags.cons.maintenance.forEach((f) => {
                    counter.cons[f] = counter.cons[f] ? ++counter.cons[f] : 1;
                });
            }
            if (flags.cons.utilities) {
                flags.cons.utilities.forEach((f) => {
                    counter.cons[f] = counter.cons[f] ? ++counter.cons[f] : 1;
                });
            }
            if (flags.cons.smells) {
                flags.cons.smells.forEach((f) => {
                    counter.cons[f] = counter.cons[f] ? ++counter.cons[f] : 1;
                });
            }
            if (flags.cons.location) {
                flags.cons.location.forEach((f) => {
                    counter.cons[f] = counter.cons[f] ? ++counter.cons[f] : 1;
                });
            }
            if (flags.cons.landlord) {
                flags.cons.landlord.forEach((f) => {
                    counter.cons[f] = counter.cons[f] ? ++counter.cons[f] : 1;
                });
            }
        });
        // COUNTER IS FULL

        const result: TopNFlagsResponse = { pros: [], cons: [] };

        let filtered = Object.entries(counter.pros)
            .concat(Object.entries(counter.cons))
            .sort(([, aval], [, bval]) => bval - aval);

        // if no n, provide count for all, could introduce some default ...
        // any topic with the same count as one that makes the top N also makes it?
        if (n) {
            filtered = filtered.slice(0, n);
        }

        for (const fc of filtered) {
            const [key, val] = fc;
            if (
                Object.keys(counter.pros)
                    .map((pro) => pro)
                    .includes(key)
            ) {
                result.pros.push({ topic: key, cnt: val });
            } else {
                result.cons.push({ topic: key, cnt: val });
            }
        }

        return result;
    }

    constructor(body: ResidenceValidator) {
        super(body);
    }
}
