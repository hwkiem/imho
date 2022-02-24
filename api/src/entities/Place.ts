import {
    Entity,
    Property,
    Collection,
    OneToMany,
    Unique,
    ManyToMany,
} from '@mikro-orm/core';
import { Ctx, Field, Float, ObjectType, Root } from 'type-graphql';
import { Base } from './Base';
import { Residence } from './Residence';
import { PlaceValidator } from '../validators/PlaceValidator';
import { MyContext } from '../utils/context';
import { EntityManager, PostgreSqlConnection } from '@mikro-orm/postgresql';
import { ImhoUser } from './ImhoUser';
import { Review } from './Review';

@ObjectType()
class RecommendRatio {
    @Field()
    recommend: number;
    @Field()
    total: number;
}

@ObjectType()
@Entity()
export class Place extends Base<Place> {
    @OneToMany(() => Residence, (r: Residence) => r.place)
    public residenceCollection = new Collection<Residence>(this);

    @Field()
    @Property()
    @Unique()
    public google_place_id: string;

    @Field()
    @Property()
    public formatted_address: string;

    @Field(() => [Residence])
    async residences(
        @Root() place: Place
    ): Promise<Collection<Residence> | null> {
        if (!place.residenceCollection.isInitialized()) {
            await place.residenceCollection.init();
        }
        return place.residenceCollection;
    }

    // a Place owns the Users it should ping about new reviews
    @ManyToMany(() => ImhoUser, 'notifyMeAbout', { owner: true })
    public notifyOnReview = new Collection<ImhoUser>(this);

    @Field(() => [ImhoUser])
    async usersTrackingThisPlace(
        @Root() place: Place
    ): Promise<Collection<ImhoUser> | null> {
        if (!place.notifyOnReview.isInitialized()) {
            await place.notifyOnReview.init();
        }
        return place.notifyOnReview;
    }

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

    async reviews(): Promise<Review[] | null> {
        const residencesRef = await this.residences(this);
        if (residencesRef === null) return null;
        const residences = await residencesRef.loadItems();

        let reviews: Review[] = [];
        for (const residence of residences) {
            const loadedReviews = await residence.reviews(residence);
            if (loadedReviews == null) continue;
            const myReviews = await loadedReviews.loadItems();
            for (const review of myReviews) reviews.push(review);
        }

        return reviews;
    }

    @Field(() => RecommendRatio, { nullable: true })
    async wouldRecommendRatio(): Promise<RecommendRatio | null> {
        const reviews = await this.reviews();
        if (reviews === null) return null;
        let recommend = 0,
            total = 0;
        for (const review of reviews) {
            if (review.rating >= 75) recommend++;
            total++;
        }

        return { recommend: recommend, total: total };
    }

    constructor(body: PlaceValidator) {
        super(body);
    }
}
