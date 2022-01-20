import { Entity, Property, Enum, Collection, OneToMany } from '@mikro-orm/core';
import { Field, Float, ObjectType, Root } from 'type-graphql';
import { Base } from './Base';
import { Residence } from './Residence';
import { PlaceType } from '../utils/enums/PlaceType.enum';
import { PlaceValidator } from '../validators/PlaceValidator';

@ObjectType()
@Entity()
export class Place extends Base<Place> {
    @OneToMany(() => Residence, (r: Residence) => r.place)
    public residenceCollection = new Collection<Residence>(this);

    @Field()
    @Property()
    public google_place_id: string;

    @Field()
    @Property()
    public formatted_address: string;

    @Field(() => [Residence])
    async residences(
        @Root() place: Place
    ): Promise<Collection<Residence> | null> {
        if (place.residenceCollection.isInitialized()) {
            return place.residenceCollection;
        } else {
            console.log('[residences] initializing residences...');
            await place.residenceCollection.init();
            return place.residenceCollection;
        }
    }

    @Field(() => Float, { nullable: true })
    async averageRating(@Root() place: Place): Promise<number | null> {
        if (!place.residenceCollection.isInitialized()) {
            console.log('[avgRating] initializing residences...');
            await place.residenceCollection.init();
        }
        let ratingSum = 0;
        let reviewCnt = 0;
        for (const res of place.residenceCollection) {
            if (!res.reviewCollection.isInitialized()) {
                await res.reviewCollection.init();
            }
            for (const rev of res.reviewCollection) {
                reviewCnt++;
                ratingSum += rev.rating;
            }
        }

        if (reviewCnt > 0) return ratingSum / reviewCnt;
        else return null;
    }

    @Field(() => PlaceType)
    @Enum(() => PlaceType)
    public type: PlaceType;

    constructor(body: PlaceValidator) {
        super(body);
    }
}
