import { QueryResult } from "pg";
import { User } from "src/User/user";
import { ResidenceGQL } from "../Residence/residence";
import { Review } from "../Review/Reviews";

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

export const rowsToResidences = (dbRes: QueryResult<any>): ResidenceGQL[] => {
  return dbRes.rows.map((item): ResidenceGQL => {
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
      coords: { lat: item.lat, lng: item.lng },
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      avgRating: item.avgrating,
    };
  });
};

export const rowsToResidencesCoords = (
  dbRes: QueryResult<any>
): ResidenceGQL[] => {
  return dbRes.rows.map((item): ResidenceGQL => {
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
      coords: { lat: item.lat, lng: item.lng },
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
