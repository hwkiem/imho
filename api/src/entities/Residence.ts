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
    @Field({ defaultValue: 'single' })
    @Property({ default: 'single' })
    public unit: string;

    @Field(() => [Review])
    @OneToMany(() => Review, (r: Review) => r.residence)
    public reviews = new Collection<Review>(this);

    @Field(() => Place)
    @ManyToOne(() => Place, {
        cascade: [Cascade.PERSIST, Cascade.REMOVE],
    })
    public place: Place;

    @Field(() => Float, { nullable: true })
    averageRating(@Root() residence: Residence): number | null {
        let ratingSum = 0;
        let numReviews = 0;

        for (const review of residence.reviews) {
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
