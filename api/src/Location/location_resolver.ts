import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import {
    FieldError,
    LocationResponse,
    PlaceIDResponse,
    SingleLocationResponse,
} from '../types/object_types';
import {
    CreateLocationInput,
    LocationQueryOptions,
} from '../types/input_types';
import { MyContext } from '../types/types';
import { Location } from './Location';
import { unpackLocation } from '../utils/mapUtils';

@Resolver(Location)
export class LocationResolver {
    @Mutation(() => SingleLocationResponse)
    async createLocation(
        @Arg('options') options: CreateLocationInput,
        @Ctx() { dataSources }: MyContext
    ): Promise<SingleLocationResponse> {
        const loc = await dataSources.googleMapsHandler.locationFromPlaceID(
            options.google_place_id
        );
        if (loc instanceof FieldError) return { errors: [loc] };

        const response = await dataSources.pgHandler.createLocation(
            loc,
            options
        );
        return response;
    }

    // get by batch of ids
    @Query(() => LocationResponse)
    async getLocationsById(
        @Arg('loc_ids', () => [Int]) ids: [number],
        @Ctx() { dataSources }: MyContext
    ): Promise<LocationResponse> {
        return await dataSources.pgHandler.getLocationsById(ids);
    }

    @Query(() => LocationResponse)
    async getLocationsByGeoScope(
        @Arg('place_id') place_id: string,
        @Arg('options', { nullable: true }) options: LocationQueryOptions,
        @Ctx() { dataSources }: MyContext
    ): Promise<LocationResponse> {
        const locationResult =
            await dataSources.googleMapsHandler.locationFromPlaceID(place_id);
        if (locationResult instanceof FieldError) {
            return { errors: [locationResult] };
        }
        const { full_address, ...args } = unpackLocation(locationResult);
        return options
            ? await dataSources.pgHandler.getLocationsNearArea(
                  locationResult,
                  args,
                  options.sort_params ? options.sort_params : undefined,
                  options.limit ? options.limit : undefined
              )
            : await dataSources.pgHandler.getLocationsNearArea(
                  locationResult,
                  args
              );
    }

    @Query(() => LocationResponse)
    async getLocationsGeneric(
        @Arg('options', { nullable: true }) options: LocationQueryOptions,
        @Ctx() { dataSources }: MyContext
    ): Promise<LocationResponse> {
        // need awaits here?
        return options
            ? await dataSources.pgHandler.getLocationsGeneric(
                  options.partial_location
                      ? options.partial_location
                      : undefined,
                  options.sort_params ? options.sort_params : undefined,
                  options.limit ? options.limit : undefined
              )
            : await dataSources.pgHandler.getLocationsGeneric();
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
