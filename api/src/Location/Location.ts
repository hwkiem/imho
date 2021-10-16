import { Arg, Ctx, Field, Float, ObjectType, Root } from 'type-graphql';
import { Residence } from '../Residence/Residence';
import { LaundryType, StoveType } from '../types/enum_types';
import { ResidenceQueryOptions } from '../types/input_types';
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
    air_conditioning?: boolean;

    @Field({ nullable: true })
    heat?: boolean;

    @Field(() => StoveType, { nullable: true })
    stove?: StoveType;

    @Field({ nullable: true })
    pool?: boolean;

    @Field({ nullable: true })
    gym?: boolean;

    @Field({ nullable: true })
    garbage_disposal?: boolean;

    @Field({ nullable: true })
    dishwasher?: boolean;

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
        @Arg('options', { nullable: true }) options: ResidenceQueryOptions,
        @Ctx() { dataSources }: MyContext
    ): Promise<Residence[] | undefined> {
        const res = options
            ? await dataSources.pgHandler.getResidencesGeneric(
                  options.partial_residence
                      ? {
                            ...options.partial_residence,
                            loc_id: location.loc_id,
                        }
                      : { loc_id: location.loc_id },
                  options.sort_params ? options.sort_params : undefined,
                  options.limit ? options.limit : undefined
              )
            : await dataSources.pgHandler.getResidencesGeneric({
                  loc_id: location.loc_id,
              });

        if (!res.errors && res.residences) {
            return res.residences;
        }
        return;
    }
}
