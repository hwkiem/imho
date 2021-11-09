import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { postgresHandler } from '../dataSources/postgres';
import { FlagTypes } from '../types/enum_types';
import { FlagInput } from '../types/input_types';
import { FlagResponse } from '../types/object_types';
import { Flag } from './Flag';

@Service()
@Resolver(Flag)
export class FlagResolver {
    constructor(private readonly pg: postgresHandler) {}
    @Mutation(() => FlagResponse)
    async createFlag(@Arg('options') input: FlagInput): Promise<FlagResponse> {
        if (
            (input.category == FlagTypes.RED && !input.red_topic) ||
            (input.category == FlagTypes.GREEN && !input.green_topic) ||
            (input.green_topic && input.red_topic)
        ) {
            return {
                errors: [{ field: 'FlagInput', message: 'malformed query' }],
            };
        }
        return await this.pg.createFlag(
            input.rev_id,
            input.category,
            input.green_topic
                ? input.green_topic
                : input.red_topic
                ? input.red_topic
                : '',
            input.intensity
        );
    }

    // get by batch of ids
    @Query(() => FlagResponse)
    async getFlagsById(
        @Arg('flag_ids', () => [Int]) ids: [number]
    ): Promise<FlagResponse> {
        return await this.pg.getFlagsById(ids);
    }

    // @Query(() => LocationResponse)
    // async getLocationsByGeoScope(
    //     @Arg('place_id') place_id: string,
    //     @Arg('options', { nullable: true }) options: LocationQueryOptions
    // ): Promise<LocationResponse> {
    //     return options
    //         ? await this.pg.getLocationsNearArea(
    //               place_id,
    //               options.partial_location
    //                   ? options.partial_location
    //                   : undefined,
    //               options.sort_params ? options.sort_params : undefined,
    //               options.limit ? options.limit : undefined
    //           )
    //         : await this.pg.getLocationsNearArea(place_id);
    // }

    // @Query(() => LocationResponse)
    // async getLocationsGeneric(
    //     @Arg('options', { nullable: true }) options: LocationQueryOptions
    // ): Promise<LocationResponse> {
    //     return options
    //         ? await this.pg.getLocationsGeneric(
    //               options.partial_location
    //                   ? options.partial_location
    //                   : undefined,
    //               options.sort_params ? options.sort_params : undefined,
    //               options.limit ? options.limit : undefined
    //           )
    //         : await this.pg.getLocationsGeneric();
    // }

    // @Query(() => LocationResponse)
    // async getLocationsBoundingBox(
    //     @Arg('perimeter') perimeter: GeoBoundaryInput,
    //     @Arg('options', { nullable: true }) options: LocationQueryOptions
    // ): Promise<LocationResponse> {
    //     if (
    //         perimeter.xMax < perimeter.xMin ||
    //         perimeter.yMax < perimeter.yMin
    //     ) {
    //         return { errors: [{ field: 'input', message: 'malformed query' }] };
    //     }
    //     return options
    //         ? await this.pg.getLocationsBoundingBox(
    //               perimeter,
    //               options.partial_location
    //                   ? options.partial_location
    //                   : undefined,
    //               options.sort_params ? options.sort_params : undefined,
    //               options.limit ? options.limit : undefined
    //           )
    //         : await this.pg.getLocationsBoundingBox(perimeter);
    // }

    // // just for dev
    // @Query(() => PlaceIDResponse)
    // async placeIdFromAddress(
    //     @Arg('address', () => String) address: string
    // ): Promise<PlaceIDResponse> {
    //     return await Container.get(googleMapsHandler).placeIdFromAddress(
    //         address
    //     );
    // }
}
