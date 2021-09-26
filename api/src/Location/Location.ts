import { Ctx, Field, Float, ObjectType, Root } from 'type-graphql';
import { Residence } from '../Residence/Residence';
import { Coords } from '../types/object_types';
import { MyContext } from '../types/types';

// @ObjectType()
// class Coords {
//     @Field()
//     lat: number;
//     @Field()
//     lng: number;
// }

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

    // Aggregates
    // need to nail this list down, which aspect of Review aggregated across entire location?
    @Field(() => Float, { nullable: true })
    avg_rent?: number;

    @Field(() => Float, { nullable: true })
    avg_rating?: number;

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
