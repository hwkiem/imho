import { Ctx, Field, Float, ObjectType, Root } from 'type-graphql';
import { Residence } from '../Residence/Residence';
import { LaundryType } from '../types/enum_types';
import { Coords } from '../types/object_types';
import { MyContext } from '../types/types';

@ObjectType()
export class Location {
    @Field()
    loc_id: number;

    @Field()
    google_place_id: string;

    @Field()
    full_address: string;

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

    // aggregates
    // averages
    @Field(() => Float, { nullable: true })
    avg_rent?: number;

    @Field(() => Float, { nullable: true })
    avg_rating?: number;

    // modes
    @Field({ nullable: true })
    pool?: boolean;

    @Field({ nullable: true })
    gym?: boolean;

    @Field({ nullable: true })
    parking?: boolean;

    @Field({ nullable: true })
    doorman?: boolean;

    @Field({ nullable: true })
    pet_friendly?: boolean;

    @Field(() => LaundryType, { nullable: true })
    laundry?: LaundryType;

    @Field({ nullable: true })
    backyard?: boolean;

    // Field Resolvers
    @Field(() => [Residence], { nullable: true })
    async myResidences(
        @Root() location: Location,
        @Ctx() { dataSources }: MyContext
    ): Promise<Residence[] | undefined> {
        const res = await dataSources.pgHandler.getResidencesGeneric({
            loc_id: location.loc_id,
        });
        if (!res.errors && res.residences) {
            return res.residences;
        }
        return;
    }
}
