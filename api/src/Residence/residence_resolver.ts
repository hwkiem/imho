import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Residence } from './residence';
import {
    AreaSearchInput,
    FieldError,
    MyContext,
    PartialResidence,
    PlaceIDResponse,
} from '../types';
import { CreateResidenceInput, ResidenceResponse } from '../types';
import { unpackLocation } from '../utils/mapUtils';

@Resolver(Residence)
export class ResidencyResolver {
    @Mutation(() => ResidenceResponse)
    async createResidency(
        @Arg('options') options: CreateResidenceInput,
        @Ctx() { dataSources }: MyContext
    ): Promise<ResidenceResponse> {
        const response = await dataSources.pgHandler.createResidence(
            await dataSources.googleMapsHandler.locationFromPlaceID(
                options.google_place_id
            ),
            options
        );
        return response;
    }

    @Query(() => ResidenceResponse)
    async getResidencesById(
        @Arg('res_ids', () => [Int]) ids: [number],
        @Ctx() { dataSources }: MyContext
    ): Promise<ResidenceResponse> {
        return await dataSources.pgHandler.getResidencesById(ids);
    }

    @Query(() => ResidenceResponse)
    async getResidencesBoundingBox(
        @Arg('corners') corners: AreaSearchInput,
        @Ctx() { dataSources }: MyContext
    ): Promise<ResidenceResponse> {
        return await dataSources.pgHandler.getResidencesBoundingBox({
            xMax: corners.ne.lng,
            xMin: corners.sw.lng,
            yMax: corners.ne.lat,
            yMin: corners.sw.lat,
        });
    }

    @Query(() => ResidenceResponse)
    async getResidencesByGeoScope(
        @Arg('place_id') place_id: string,
        @Arg('limit', { nullable: true }) limit: number,
        @Ctx()
        { dataSources }: MyContext
    ): Promise<ResidenceResponse> {
        const locationResult =
            await dataSources.googleMapsHandler.locationFromPlaceID(place_id);
        if (locationResult instanceof FieldError) {
            return { errors: [locationResult] };
        }
        const { full_address, ...args } = unpackLocation(locationResult);
        return await dataSources.pgHandler.getResidencesNearArea(
            args,
            locationResult,
            limit
        );
    }

    @Query(() => ResidenceResponse)
    async getResidencesLimit(
        @Arg('limit', () => Int) limit: number,
        @Ctx() { dataSources }: MyContext
    ): Promise<ResidenceResponse> {
        return await dataSources.pgHandler.getResidencesLimit(limit);
    }

    // get by placeID
    @Query(() => ResidenceResponse)
    async getResidencesFromPlaceId(
        @Arg('place_id', () => String) place_id: string,
        @Ctx() { dataSources }: MyContext
    ): Promise<ResidenceResponse> {
        return await dataSources.pgHandler.getResidencesObject({
            google_place_id: place_id,
        });
    }

    @Query(() => ResidenceResponse)
    async getResidencesObjectFilter(
        @Arg('obj') obj: PartialResidence,
        @Ctx() { dataSources }: MyContext
    ): Promise<ResidenceResponse> {
        return await dataSources.pgHandler.getResidencesObject(obj);
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
