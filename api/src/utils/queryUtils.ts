import { QueryResult } from 'pg';
import { User } from 'src/entities/User';
import { Residence } from '../entities/Residence';
import { Review } from '../entities/Reviews';
import { Coords } from '../resolvers/types';

export const rowsToUsers = (dbRes: QueryResult<any>): User[] => {
  return dbRes.rows.map((item) => {
    return {
      userId: item.user_id,
      email: item.email,
      firstName: item.first_name,
      lastName: item.last_name,
      password: item.password,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };
  });
};

export const rowsToResidences = (dbRes: QueryResult<any>): Residence[] => {
  return dbRes.rows.map((item): Residence => {
    // const lat = item.
    return {
      resID: item.res_id,
      google_place_id: item.google_place_id,
      full_address: item.full_address,
      apt_num: item.apt_num,
      street_num: item.street_num,
      route: item.route,
      city: item.city,
      state: item.state,
      postal_code: item.postal_code,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      avgRating: item.avgrating,
    };
  });
};

export const rowsToResidencesCoords = (dbRes: QueryResult<any>): Residence[] => {
  return dbRes.rows.map((item): Residence => {
    // const lat = item.
    const cords: Coords = { lat: item.lat, lng: item.lng };
    return {
      resID: item.res_id,
      google_place_id: item.google_place_id,
      full_address: item.full_address,
      apt_num: item.apt_num,
      street_num: item.street_num,
      route: item.route,
      city: item.city,
      state: item.state,
      postal_code: item.postal_code,
      coords: cords,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      avgRating: item.avgrating,
    };
  });
};

export const rowsToReviews = (dbRes: QueryResult<any>): Review[] => {
  return dbRes.rows.map((item) => {
    return {
      userId: item.user_id,
      resId: item.res_id,
      rating: item.rating,
      rent: item.rent,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
    };
  });
};
