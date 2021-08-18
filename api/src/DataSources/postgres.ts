import { SQLDataSource } from 'datasource-sql';
import {
  Coords,
  RegisterInput,
  ResidenceResponse,
  UserResponse,
} from '../types';
import argon2 from 'argon2';
import { UserGQL } from '../User/user';
import { ResidenceGQL } from '../Residence/residence';
import { GeocodeResult } from '@googlemaps/google-maps-services-js';
import { unpackLocation } from '../utils/mapUtils';
import KnexPostgis from 'knex-postgis';

const knexConfig = {
  client: 'pg',
  connection: {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT!),
  },
};

export class postgresHandler extends SQLDataSource {
  constructor() {
    super(knexConfig);
  }
  // Users
  async getUsersById(ids: [number]): Promise<UserResponse> {
    let r: UserResponse = {};
    await this.knex<UserGQL>('users')
      .select('*')
      .where('user_id', 'in', ids) // in
      .then((users) => (r.users = users))
      .catch(
        (e) => (r.errors = [{ field: 'query user', message: e.toString() }])
      );
    return r;
  }

  async getUsersLimit(limit: number): Promise<UserResponse> {
    let r: UserResponse = {};
    await this.knex<UserGQL>('users')
      .select('*')
      .limit(limit)
      .then((users) => (r.users = users))
      .catch(
        (e) => (r.errors = [{ field: 'query user', message: e.toString() }])
      );
    return r;
  }

  async getUsersObject(obj: Partial<UserGQL>): Promise<UserResponse> {
    let r: UserResponse = {};
    await this.knex<UserGQL>('users')
      .select('*')
      .where(obj)
      .then((users) => (r.users = users))
      .catch(
        (e) => (r.errors = [{ field: 'query user', message: e.toString() }])
      );
    return r;
  }

  async createUser(input: RegisterInput): Promise<UserResponse> {
    let r: UserResponse = {};
    input.password = await argon2.hash(input.password);
    const args = {
      ...input,
      created_at: this.knex.fn.now(),
      updated_at: this.knex.fn.now(),
    };
    await this.knex<UserGQL>('users')
      .insert(args)
      .returning('*')
      .then((users) => (r.users = users))
      .catch(
        (e) => (r.errors = [{ field: 'insert user', message: e.toString() }])
      );
    return r;
  }

  async deleteUser(id: number): Promise<UserResponse> {
    let r: UserResponse = {};
    await this.knex<UserGQL>('users')
      .where('user_id', '=', id)
      .del()
      .returning('*')
      .then((user) => (r.users = user))
      .catch(
        (e) => (r.errors = [{ field: 'delete user', message: e.toString() }])
      );
    return r;
  }

  // Residences
  async createResidence(
    input: Partial<ResidenceGQL>,
    location: GeocodeResult
  ): Promise<ResidenceResponse> {
    const postgis = KnexPostgis(this.knex);
    const args = {
      ...input,
      ...unpackLocation(location),
      geog: postgis.geographyFromText(
        'Point(' +
          location.geometry.location.lat +
          ' ' +
          location.geometry.location.lng +
          ')'
      ),
      created_at: this.knex.fn.now(),
      updated_at: this.knex.fn.now(),
    };

    let r: ResidenceResponse = {};
    await this.knex<ResidenceGQL>('residences')
      .insert(args)
      .returning('res_id')
      .then(async (ids) => {
        await this.getResidencesById(ids)
          .then((res) => {
            r.residences = res.residences;
          })
          .catch(
            (e) =>
              (r.errors = [{ field: 'delete user', message: e.toString() }])
          );
      })
      .catch(
        (e) =>
          (r.errors = [{ field: 'create residence', message: e.toString() }])
      );

    return r;
  }

  async getResidencesById(ids: number[]): Promise<ResidenceResponse> {
    let r: ResidenceResponse = {};
    const x = await this.knex.raw(
      `SELECT residences.res_id, full_address, apt_num, street_num, route, city, state, postal_code, st_y(geog::geometry) AS lng, st_x(geog::geometry) AS lat,
    AVG(rating) AS avg_rating, AVG(rent) AS avg_rent, residences.created_at, residences.updated_at
    FROM residences LEFT OUTER JOIN reviews on residences.res_id = reviews.res_id
    WHERE residences.res_id IN (?)
    GROUP BY residences.res_id`,
      ids
    );
    if (!x.rows) {
      r.errors = [
        { field: 'select residences', message: 'no residences with those ids' },
      ];
    } else {
      r.residences = x.rows.map((i: any) => {
        const { lat, lng, ...res } = i;
        return { coords: { lat: lat, lng: lng }, ...res };
      });
    }

    return r;
  }

  async getResidencesLimit(limit: number): Promise<ResidenceResponse> {
    let r: ResidenceResponse = {};
    const x = await this.knex.raw(
      `SELECT residences.res_id, full_address, apt_num, street_num, route, city, state, postal_code, st_y(geog::geometry) AS lng, st_x(geog::geometry) AS lat,
    AVG(rating) AS avg_rating, AVG(rent) AS avg_rent, residences.created_at, residences.updated_at
    FROM residences LEFT OUTER JOIN reviews on residences.res_id = reviews.res_id
    GROUP BY residences.res_id
    LIMIT ?`,
      limit
    );
    if (!x.rows) {
      r.errors = [
        { field: 'select residences', message: 'no residences with those ids' },
      ];
    } else {
      r.residences = x.rows.map((i: any) => {
        const { lat, lng, ...res } = i;
        return { coords: { lat: lat, lng: lng }, ...res };
      });
    }

    return r;
  }

  async getCoords(id: number): Promise<Coords> {
    const res = await this.knex.raw(
      `SELECT st_y(geog::geometry) AS lng, st_x(geog::geometry) AS lat FROM residences WHERE res_id = ${id}`
    );

    return res.rows[0];
  }
}
