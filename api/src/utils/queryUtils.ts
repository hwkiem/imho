// import { QueryResult } from 'pg';
// import { UserGQL } from 'src/User/user';
// import { ResidenceGQL } from '../Residence/residence';
// import { ReviewGQL } from '../Review/Reviews';

// // REDUCERS

// export const rowsToUsers = (dbRes: QueryResult<any>): UserGQL[] => {
//   return dbRes.rows.map((item) => {
//     return {
//       user_id: item.user_id,
//       email: item.email,
//       first_name: item.first_name,
//       last_name: item.last_name,
//       password: item.password,
//       created_at: item.created_at,
//       updated_at: item.updated_at,
//     };
//   });
// };

// export const rowsToResidences = (dbRes: QueryResult<any>): ResidenceGQL[] => {
//   return dbRes.rows.map((item): ResidenceGQL => {
//     return {
//       res_id: item.res_id,
//       google_place_id: item.google_place_id,
//       full_address: item.full_address,
//       apt_num: item.apt_num,
//       street_num: item.street_num,
//       route: item.route,
//       city: item.city,
//       state: item.state,
//       postal_code: item.postal_code,
//       coords: { lat: item.lat, lng: item.lng },
//       created_at: item.created_at,
//       updated_at: item.updated_at,
//       avgRating: item.avg_rating,
//       avgRent: item.avg_rent,
//     };
//   });
// };

// export const rowsToReviews = (dbRes: QueryResult<any>): ReviewGQL[] => {
//   return dbRes.rows.map((item) => {
//     return {
//       userId: item.user_id,
//       resId: item.res_id,
//       rating: item.rating,
//       rent: item.rent,
//       createdAt: item.created_at,
//       updatedAt: item.updated_at,
//     };
//   });
// };
