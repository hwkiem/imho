import { ObjectType, Field, Float } from 'type-graphql';

@ObjectType()
class Coords {
    @Field()
    lat: number;
    @Field()
    lng: number;
}

@ObjectType()
export class Residence {
    @Field()
    res_id: number;

    @Field()
    google_place_id: string;

    // Location
    @Field()
    full_address: string;

    @Field({ nullable: true })
    apt_num?: string;

    @Field()
    street_num: string;

    @Field()
    route: string;

    @Field()
    city: string;

    @Field()
    state: string;

    @Field()
    postal_code: string;

    @Field(() => Coords)
    coords: Coords;

    geog: any;

    // Review
    @Field(() => Float, { nullable: true })
    avg_rating?: number;

    @Field({ nullable: true })
    avg_rent?: number;

    // Features
    @Field()
    bed_count: number;

    

    @Field(() => String)
    created_at = new Date();

    @Field(() => String)
    updated_at = new Date();
}
