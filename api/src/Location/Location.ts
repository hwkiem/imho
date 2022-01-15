import { Arg, Field, Float, ObjectType, Root } from 'type-graphql';
import Container from 'typedi';
import { postgresHandler } from '../dataSources/postgres';
import { Residence } from '../Residence/Residence';
import { LocationCategory } from '../types/enum_types';
import { ResidenceQueryOptions } from '../types/input_types';
import { Coords } from '../types/object_types';

@ObjectType()
export class Location {
    @Field()
    loc_id: number;

    @Field(() => Float, { nullable: true })
    imho_score?: number;

    @Field({ nullable: true })
    landlord_email?: string;

    @Field(() => LocationCategory)
    category: LocationCategory;

    @Field()
    google_place_id: string;

    @Field()
    formatted_address: string;

    @Field(() => Coords)
    coords: Coords;

    geog: any; // eslint-disable-line @typescript-eslint/no-explicit-any

    // aggregates
    // averages
    @Field(() => Float, { nullable: true })
    avg_rating?: number;

    // Field Resolvers
    // Residences found at this location
    @Field(() => [Residence], { nullable: true })
    async residences(
        @Root() location: Location,
        @Arg('options', { nullable: true }) options: ResidenceQueryOptions
    ): Promise<Residence[] | undefined> {
        const pg = Container.get(postgresHandler);
        const res = options
            ? await pg.getResidencesGeneric(
                  options.partial_residence
                      ? {
                            ...options.partial_residence,
                            loc_id: location.loc_id,
                        }
                      : { loc_id: location.loc_id },
                  options.sort_params ? options.sort_params : undefined,
                  options.limit ? options.limit : undefined
              )
            : await pg.getResidencesGeneric({
                  loc_id: location.loc_id,
              });

        if (!res.errors && res.residences) {
            return res.residences;
        }
        return;
    }
}
