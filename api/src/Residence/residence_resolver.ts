import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Residence } from './residence';
import {
    FieldError,
    GeoBoundaryInput,
    MyContext,
    PartialResidence,
    PlaceIDResponse,
    ResidenceSortByInput,
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
        @Arg('perimeter') perimeter: GeoBoundaryInput,
        @Ctx() { dataSources }: MyContext
    ): Promise<ResidenceResponse> {
        if (
            perimeter.xMax < perimeter.xMin ||
            perimeter.yMax < perimeter.yMin
        ) {
            return { errors: [{ field: 'input', message: 'malformed query' }] };
        }
        return await dataSources.pgHandler.getResidencesBoundingBox(perimeter);
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
    async getResidencesSortBy(
        @Arg('obj') obj: PartialResidence,
        @Arg('sort_params', { nullable: true }) params: ResidenceSortByInput,
        @Arg('limit', { nullable: true }) limit: number,
        @Ctx() { dataSources }: MyContext
    ): Promise<ResidenceResponse> {
        const a = ['avg_rent', 'avg_rating'];
        const b = ['asc', 'desc'];
        if (!a.includes(params.attribute) || !b.includes(params.sort)) {
            return {
                errors: [
                    {
                        field: 'sort_params',
                        message:
                            'attribute one of ' + a + ' and sort one of ' + b,
                    },
                ],
            };
        }
        return await dataSources.pgHandler.getResidencesSortBy(
            obj,
            params,
            limit
        );
    }

    @Query(() => ResidenceResponse)
    async getResidencesObjectFilter(
        @Arg('obj') obj: PartialResidence,
        @Arg('limit', { nullable: true }) limit: number,
        @Ctx() { dataSources }: MyContext
    ): Promise<ResidenceResponse> {
        return await dataSources.pgHandler.getResidencesObject(obj, limit);
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
