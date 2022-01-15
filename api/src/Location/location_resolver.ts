import { Arg, Int, Query, Resolver } from 'type-graphql';
import {
    LocationResponse,
    PlaceIDResponse,
    SingleLocationResponse,
} from '../types/object_types';
import { GeoBoundaryInput, LocationQueryOptions } from '../types/input_types';
import { Location } from './Location';
import Container, { Service } from 'typedi';
import { postgresHandler } from '../dataSources/postgres';
import { googleMapsHandler } from '../dataSources/mapsAPI';
import { LocationCategory } from '../types/enum_types';

@Service()
@Resolver(Location)
export class LocationResolver {
    constructor(private readonly pg: postgresHandler) {}
    // @Mutation(() => SingleLocationResponse)
    async createLocation(
        @Arg('place_id') place_id: string,
        @Arg('category', () => LocationCategory)
        category: LocationCategory,
        @Arg('landlord_email')
        landlord_email: string
    ): Promise<SingleLocationResponse> {
        return await this.pg.createLocation(place_id, category, landlord_email);
    }

    // get by batch of ids
    @Query(() => LocationResponse)
    async getLocationsById(
        @Arg('loc_ids', () => [Int]) ids: [number]
    ): Promise<LocationResponse> {
        return await this.pg.getLocationsById(ids);
    }

    // @Query(() => LocationResponse)
    async getLocationsByGeoScope(
        @Arg('place_id') place_id: string,
        @Arg('options', { nullable: true }) options: LocationQueryOptions
    ): Promise<LocationResponse> {
        return options
            ? await this.pg.getLocationsNearArea(
                  place_id,
                  options.partial_location
                      ? options.partial_location
                      : undefined,
                  options.sort_params ? options.sort_params : undefined,
                  options.limit ? options.limit : undefined
              )
            : await this.pg.getLocationsNearArea(place_id);
    }

    @Query(() => LocationResponse)
    async getLocationsGeneric(
        @Arg('options', { nullable: true }) options: LocationQueryOptions
    ): Promise<LocationResponse> {
        return options
            ? await this.pg.getLocationsGeneric(
                  options.partial_location
                      ? options.partial_location
                      : undefined,
                  options.sort_params ? options.sort_params : undefined,
                  options.limit ? options.limit : undefined
              )
            : await this.pg.getLocationsGeneric();
    }

    @Query(() => LocationResponse)
    async getLocationsBoundingBox(
        @Arg('perimeter') perimeter: GeoBoundaryInput,
        @Arg('options', { nullable: true }) options: LocationQueryOptions
    ): Promise<LocationResponse> {
        if (
            perimeter.xMax < perimeter.xMin ||
            perimeter.yMax < perimeter.yMin
        ) {
            return { errors: [{ field: 'input', message: 'malformed query' }] };
        }
        return options
            ? await this.pg.getLocationsBoundingBox(
                  perimeter,
                  options.partial_location
                      ? options.partial_location
                      : undefined,
                  options.sort_params ? options.sort_params : undefined,
                  options.limit ? options.limit : undefined
              )
            : await this.pg.getLocationsBoundingBox(perimeter);
    }

    // Main entryway
    //
    @Query(() => SingleLocationResponse)
    async getLocationByPlaceId(
        @Arg('google_place_id') place_id: string
    ): Promise<SingleLocationResponse> {
        return await this.pg.getLocationByPlaceId(place_id);
    }

    // just for dev
    // @Query(() => PlaceIDResponse)
    async placeIdFromAddress(
        @Arg('address', () => String) address: string
    ): Promise<PlaceIDResponse> {
        return await Container.get(googleMapsHandler).placeIdFromAddress(
            address
        );
    }
}
