import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Residence } from './residence';
import { unpackLocation } from '../utils/mapUtils';
import {
    FieldError,
    PlaceIDResponse,
    ResidenceResponse,
    SingleResidenceResponse,
} from '../types/object_types';
import {
    CreateResidenceInput,
    GeoBoundaryInput,
    ResidenceQueryOptions,
} from '../types/input_types';
import { MyContext } from '../types/types';

@Resolver(Residence)
export class ResidencyResolver {
    @Mutation(() => SingleResidenceResponse)
    async createResidency(
        @Arg('options') options: CreateResidenceInput,
        @Ctx() { dataSources }: MyContext
    ): Promise<SingleResidenceResponse> {
        const response = await dataSources.pgHandler.createResidence(
            await dataSources.googleMapsHandler.locationFromPlaceID(
                options.google_place_id
            ),
            options
        );
        return response;
    }

    // get by batch of ids
    @Query(() => ResidenceResponse)
    async getResidencesById(
        @Arg('res_ids', () => [Int]) ids: [number],
        @Ctx() { dataSources }: MyContext
    ): Promise<ResidenceResponse> {
        return await dataSources.pgHandler.getResidencesById(ids);
    }

    // location agnostic
    @Query(() => ResidenceResponse)
    async getResidencesGeneric(
        @Arg('options', { nullable: true }) options: ResidenceQueryOptions,
        @Ctx() { dataSources }: MyContext
    ): Promise<ResidenceResponse> {
        // need awaits here?
        return options
            ? await dataSources.pgHandler.getResidencesGeneric(
                  options.partial_residence
                      ? options.partial_residence
                      : undefined,
                  options.sort_params ? options.sort_params : undefined,
                  options.limit ? options.limit : undefined
              )
            : await dataSources.pgHandler.getResidencesGeneric();
    }

    @Query(() => ResidenceResponse)
    async getResidencesBoundingBox(
        @Arg('perimeter') perimeter: GeoBoundaryInput,
        @Arg('options', { nullable: true }) options: ResidenceQueryOptions,
        @Ctx() { dataSources }: MyContext
    ): Promise<ResidenceResponse> {
        if (
            perimeter.xMax < perimeter.xMin ||
            perimeter.yMax < perimeter.yMin
        ) {
            return { errors: [{ field: 'input', message: 'malformed query' }] };
        }
        return options
            ? await dataSources.pgHandler.getResidencesBoundingBox(
                  perimeter,
                  options.partial_residence
                      ? options.partial_residence
                      : undefined,
                  options.sort_params ? options.sort_params : undefined,
                  options.limit ? options.limit : undefined
              )
            : await dataSources.pgHandler.getResidencesBoundingBox(perimeter);
    }

    @Query(() => ResidenceResponse)
    async getResidencesByGeoScope(
        @Arg('place_id') place_id: string,
        @Arg('options', { nullable: true }) options: ResidenceQueryOptions,
        @Ctx() { dataSources }: MyContext
    ): Promise<ResidenceResponse> {
        const locationResult =
            await dataSources.googleMapsHandler.locationFromPlaceID(place_id);
        if (locationResult instanceof FieldError) {
            return { errors: [locationResult] };
        }
        const { full_address, ...args } = unpackLocation(locationResult);
        return options
            ? await dataSources.pgHandler.getResidencesNearArea(
                  locationResult,
                  args,
                  options.sort_params ? options.sort_params : undefined,
                  options.limit ? options.limit : undefined
              )
            : await dataSources.pgHandler.getResidencesNearArea(
                  locationResult,
                  args
              );
    }

    // just for dev
    @Query(() => PlaceIDResponse)
    async placeIdFromAddress(
        @Arg('address', () => String) address: string,
        @Ctx() { dataSources }: MyContext
    ): Promise<PlaceIDResponse> {
        return await dataSources.googleMapsHandler.placeIdFromAddress(address);
    }
}
