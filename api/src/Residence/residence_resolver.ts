import { GeocodeResult } from '@googlemaps/google-maps-services-js';
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql';
import { ResidenceGQL } from './residence';
import { MyContext } from '../types';
import { geoToData, unpackLocation } from '../utils/mapUtils';
import { rowsToResidences, rowsToResidencesCoords } from '../utils/queryUtils';
import { CreateResidencyInput, ResidencyResponse } from '../types';

@Resolver(ResidenceGQL)
export class ResidencyResolver {
  @Mutation(() => ResidencyResponse)
  async createResidency(
    @Arg('options') options: CreateResidencyInput,
    @Ctx() { pool, client }: MyContext
  ): Promise<ResidencyResponse> {
    try {
      const location: GeocodeResult = geoToData(
        await client.geocode({
          params: {
            address: options.address,
            key: process.env.GOOGLE_MAPS_API_KEY!,
          },
        })
      );
      const pg = await pool.connect();
      const dbRes = await pg.query(
        `
        INSERT INTO residences (
          google_place_id, 
          full_address, 
          apt_num,
          street_num, 
          route,
          city, 
          state,
          postal_code,
          geog,
          created_at, 
          updated_at
          )  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *
        `,
        [
          location.place_id,
          location.formatted_address,
          ...unpackLocation(location),
          'Point(' +
            location.geometry.location.lat +
            ' ' +
            location.geometry.location.lng +
            ')',
        ]
      );

      if (dbRes.rowCount == 0) {
        return { errors: [{ message: 'insert', field: 'could not insert' }] };
      }
      const res = rowsToResidences(dbRes)[0];
      const sub = await pg.query(
        'SELECT st_y(geog::geometry) AS lng, st_x(geog::geometry) AS lat FROM residences'
        // 'SELECT ST_AsEWKT(geog) AS hm FROM residences'
      );
      pg.release();
      if (sub.rowCount == 0) {
        return {
          errors: [{ message: 'insert', field: 'could not collect coords' }],
        };
      }
      res.coords = { lat: sub.rows[0].lat, lng: sub.rows[0].lng };
      return { residency: res };
    } catch (errs) {
      console.log(errs);
    }
    return {};
  }

  @Query(() => [ResidenceGQL])
  async getResidences(@Ctx() { pool }: MyContext): Promise<ResidenceGQL[]> {
    const pg = await pool.connect();
    const dbRes =
      await pg.query(`SELECT residences.res_id, full_address, apt_num, street_num, route, city, state, postal_code, st_y(geog::geometry) AS lng, st_x(geog::geometry) AS lat, AVG(rating) AS avgRating, residences.created_at, residences.updated_at 
    FROM residences LEFT OUTER JOIN reviews on residences.res_id = reviews.res_id GROUP BY residences.res_id`);
    pg.release();
    return rowsToResidencesCoords(dbRes);
  }

  @Query(() => [ResidenceGQL], { nullable: true })
  async useGoogle(
    @Arg('address') address: string,
    @Ctx() { client, pool }: MyContext
  ): Promise<ResidenceGQL[]> {
    try {
      const val = await client.geocode({
        params: { address: address, key: process.env.GOOGLE_MAPS_API_KEY! },
      });
      console.log(val.data.results[0]);
    } catch (e) {
      console.log(e);
    }

    const pg = await pool.connect();
    const dbRes =
      await pg.query(`SELECT residences.res_id, address, AVG(rating) AS avgRating, residences.created_at, residences.updated_at
    FROM residences LEFT OUTER JOIN reviews on residences.res_id = reviews.res_id GROUP BY residences.res_id`);
    pg.release();
    return rowsToResidences(dbRes);
  }
}
