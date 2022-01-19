import { Entity, Property, Enum, Collection, OneToMany } from '@mikro-orm/core';
import { Field, Float, ObjectType, Root } from 'type-graphql';
import { Base } from './Base';
import { Residence } from './Residence';
import { PlaceType } from '../utils/enums/PlaceType.enum';
import { PlaceValidator } from '../validators/PlaceValidator';

@ObjectType()
@Entity()
export class Place extends Base<Place> {
    @Field()
    @Property()
    public google_place_id: string;

    @Field()
    @Property()
    public formatted_address: string;

    @Field(() => [Residence])
    @OneToMany(() => Residence, (r: Residence) => r.place)
    public residences = new Collection<Residence>(this);

    @Field(() => PlaceType)
    @Enum(() => PlaceType)
    public type: PlaceType;

    @Field(() => Float, { nullable: true })
    averageRating(@Root() place: Place): number | null {
        let ratingSum = 0;
        let numReviews = 0;

        for (const residence of place.residences) {
            for (const review of residence.reviews) {
                ratingSum += review.rating;
                numReviews++;
            }
        }

        if (numReviews == 0) {
            return null;
        } else {
            return ratingSum / numReviews;
        }
    }

    constructor(body: PlaceValidator) {
        super(body);
    }
}
