import { GeocodeResult } from '@googlemaps/google-maps-services-js';
import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { ResidenceGQL } from './residence';
import { MyContext } from '../types';
import { geoToData } from '../utils/mapUtils';
import { CreateResidenceInput, ResidenceResponse } from '../types';

@Resolver(ResidenceGQL)
export class ResidencyResolver {
  @Mutation(() => ResidenceResponse)
  async createResidency(
    @Arg('options') options: CreateResidenceInput,
    @Ctx() { dataSources, client }: MyContext
  ): Promise<ResidenceResponse> {
    let location: GeocodeResult;
    try {
      location = geoToData(
        await client.geocode({
          params: {
            place_id: options.google_place_id,
            key: process.env.GOOGLE_MAPS_API_KEY!,
          },
        })
      );
    } catch (e) {
      return { errors: [{ field: 'googleAPI', message: e.toString() }] };
    }

    const response = await dataSources.pgHandler.createResidence(
      options,
      location
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
  async getResidencesLimit(
    @Arg('limit', () => Int) limit: number,
    @Ctx() { dataSources }: MyContext
  ): Promise<ResidenceResponse> {
    return await dataSources.pgHandler.getResidencesLimit(limit);
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
