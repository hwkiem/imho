import {
    Cascade,
    Collection,
    Entity,
    ManyToOne,
    OneToMany,
    Property,
} from '@mikro-orm/core';
import { Review } from './Review';
import { Field, Float, ObjectType, Root } from 'type-graphql';
import { Base } from './Base';
import { ResidenceValidator } from '../validators/ResidenceValidator';
import { Place } from './Place';

@ObjectType()
@Entity()
export class Residence extends Base<Residence> {
    @OneToMany(() => Review, (r: Review) => r.residence)
    public reviewCollection = new Collection<Review>(this);

    @Field({ defaultValue: 'single' })
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
    async averageRating(@Root() residence: Residence): Promise<number | null> {
        if (!residence.reviewCollection.isInitialized()) {
            await residence.reviewCollection.init();
        }

        let ratingSum = 0;
        let numReviews = 0;

        for (const review of residence.reviewCollection) {
            ratingSum += review.rating;
            numReviews++;
        }

        if (numReviews == 0) {
            return null;
        } else {
            return ratingSum / numReviews;
        }
    }

    constructor(body: ResidenceValidator) {
        super(body);
    }
}
