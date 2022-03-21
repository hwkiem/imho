import {
    Entity,
    Property,
    Collection,
    OneToMany,
    Unique,
    ManyToMany,
} from '@mikro-orm/core';
import { Arg, Ctx, Field, Float, Int, ObjectType, Root } from 'type-graphql';
import { Base } from './Base';
import { Residence } from './Residence';
import { PlaceValidator } from '../validators/PlaceValidator';
import { MyContext } from '../utils/context';
import { EntityManager, PostgreSqlConnection } from '@mikro-orm/postgresql';
import { ImhoUser } from './ImhoUser';
import { Review } from './Review';
import { TopNFlagsResponse } from '../utils/types/Flag';

@ObjectType()
class RecommendRatio {
    // round to 3.7/5
    @Field(() => Float)
    recommend: number;
    @Field()
    total: number;
}

@ObjectType()
@Entity()
export class Place extends Base<Place> {
    @OneToMany(() => Residence, (r: Residence) => r.place)
    public residenceCollection = new Collection<Residence>(this);

    /**
     * Residences that exist at this place
     */
    @Field(() => [Residence])
    async residences(
        @Root() place: Place
    ): Promise<Collection<Residence> | null> {
        if (!place.residenceCollection.isInitialized()) {
            await place.residenceCollection.init();
        }
        return place.residenceCollection;
    }

    @ManyToMany(() => ImhoUser, 'notifyMeAbout', { owner: true })
    public notifyOnReview = new Collection<ImhoUser>(this);

    /**
     * Users who are tracking this place
     * a Place owns the Users it should ping about new reviews
     */
    @Field(() => [ImhoUser])
    async usersTrackingThisPlace(
        @Root() place: Place
    ): Promise<Collection<ImhoUser> | null> {
        if (!place.notifyOnReview.isInitialized()) {
            await place.notifyOnReview.init();
        }
        return place.notifyOnReview;
    }

    /**
     * The reviews written about this place
     */
    @Field(() => [Review], { nullable: true })
    async reviews(): Promise<Review[] | null> {
        const residencesRef = await this.residences(this);
        if (residencesRef === null) return null;
        const residences = await residencesRef.loadItems();

        const reviews: Review[] = [];
        for (const residence of residences) {
            const loadedReviews = await residence.reviews(residence);
            if (loadedReviews === null) continue;
            const myReviews = await loadedReviews.loadItems();

            for (const review of myReviews) reviews.push(review);
        }

        return reviews;
    }

    @Field(() => TopNFlagsResponse, { nullable: true })
    async topNFlags(
        @Root() place: Place,
        @Arg('n', () => Int, { nullable: true }) n?: number | undefined
    ): Promise<TopNFlagsResponse | null> {
        const residencesRef = await place.residences(place);
        if (residencesRef === null) return null;
        const residences = await residencesRef.loadItems();

        // get TopFlags of all residences
        console.log('before');
        const topFlags: TopNFlagsResponse[] = [];
        await (async () => {
            for (const residence of residences) {
                const top = await residence.topNFlags(residence); // no n, fetching all flags and count
                if (top === undefined) return;

                topFlags.push(top);
                console.log('topFlags became ', topFlags);
            }
        })();

        console.log('who care ab', n);

        // const f = () => {
        //     residences.forEach(async (residence) => {
        //         const top = await residence.topNFlags(residence, n); // no n, fetching all flags and count
        //         if (top === undefined) return;

        //         topFlags.push(top);
        //         console.log('topFlags became ', topFlags);
        //     });
        // };

        console.log('after topFlags is ', topFlags);
        // tally TopFlags of all residences into a single response
        return topFlags.reduce(
            (prev, cur) => {
                cur.pros.forEach((proWithCount) => {
                    // if already has a FlagWithCount
                    if (prev.pros.some((e) => e.topic === proWithCount.topic)) {
                        // iterate the FlagWithCount for this topic
                        prev.pros.filter(
                            (pro) => pro.topic === proWithCount.topic
                        )[0].cnt += 1;
                    } else {
                        prev.pros.push({
                            topic: proWithCount.topic,
                            cnt: proWithCount.cnt,
                        });
                    }
                });

                cur.cons.forEach((conWithCount) => {
                    // if already has a FlagWithCount
                    if (prev.cons.some((e) => e.topic === conWithCount.topic)) {
                        // iterate the FlagWithCount for this topic
                        prev.cons.filter(
                            (con) => con.topic === conWithCount.topic
                        )[0].cnt += 1;
                    } else {
                        prev.cons.push({
                            topic: conWithCount.topic,
                            cnt: conWithCount.cnt,
                        });
                    }
                });
                console.log('in reduce returning ', prev);
                return prev;
            },
            { pros: [], cons: [] }
        );
    }

    /* Properties */
    @Field()
    @Property()
    @Unique()
    public google_place_id: string;

    @Field()
    @Property()
    public formatted_address: string;

    /* Averages and stats across reviews */
    @Field(() => Float, { nullable: true })
    async averageRating(
        @Root() place: Place,
        @Ctx() { em }: MyContext
    ): Promise<number | null> {
        const knex = (
            (em as EntityManager).getConnection() as PostgreSqlConnection
        ).getKnex();

        const res = await knex
            .avg('rating')
            .from('review')
            .where(
                'review.residence_id',
                'in',
                knex
                    .select('id')
                    .from('residence')
                    .where('place_id', '=', place.id)
            );

        if (!res[0].avg) return null;
        return +res[0].avg;
    }

    @Field(() => RecommendRatio, { nullable: true })
    async wouldRecommendRatio(): Promise<RecommendRatio | null> {
        const reviews = await this.reviews();
        if (reviews === null) return null;
        const recommend = reviews.filter((r) => r.rating >= 75).length,
            total = reviews.length,
            CONVENTIONAL_DENOM = 5;

        return total < CONVENTIONAL_DENOM
            ? { recommend: recommend, total: total }
            : {
                  recommend: (CONVENTIONAL_DENOM * recommend) / total,
                  total: CONVENTIONAL_DENOM,
              };
    }

    @Field(() => Int, { nullable: true })
    async reviewCount(): Promise<number | null> {
        const reviews = await this.reviews();
        if (reviews === null) return null;
        return reviews === null ? null : reviews.length;
    }

    constructor(body: PlaceValidator) {
        super(body);
    }
}
