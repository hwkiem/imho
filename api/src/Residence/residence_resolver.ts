import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Residence } from './residence';
import { MyContext, PartialResidence, PlaceIDResponse } from '../types';
import { CreateResidenceInput, ResidenceResponse } from '../types';

@Resolver(Residence)
export class ResidencyResolver {
    @Mutation(() => ResidenceResponse)
    async createResidency(
        @Arg('options') options: CreateResidenceInput,
        @Ctx() { dataSources }: MyContext
    ): Promise<ResidenceResponse> {
        const response = await dataSources.pgHandler.createResidence(
            options,
            dataSources.googleMapsHandler.locationFromPlaceID
        );
        console.log(response);
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

    @Query(() => ResidenceResponse) // return number of rows returned? everywhere?
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

    // // get by placeID
    // @Query(() => ResidenceGQL)
    // async getByPlaceID(
    //   @Arg('placeId') placeId: string,
    //   @Ctx() { pool }: MyContext
    // ): Promise<ResidenceGQL> {
    //   const pg = await pool.connect();
    //   const dbRes = await pg.query(
    //     `SELECT residences.res_id, full_address, apt_num, street_num, route, city, state, postal_code, st_y(geog::geometry) AS lng, st_x(geog::geometry) AS lat, AVG(rating) AS avgRating, residences.created_at, residences.updated_at
    //   FROM residences LEFT OUTER JOIN reviews on residences.res_id = reviews.res_id WHERE google_place_id = $1 GROUP BY residences.res_id`,
    //     [placeId]
    //   );
    //   pg.release();
    //   return rowsToResidences(dbRes)[0];
    // }
}
