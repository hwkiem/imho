import { postgresHandler } from '../dataSources/postgres';
import { Review } from '../Review/Review';
import KnexPostgis from 'knex-postgis';
import { Knex, knex } from 'knex';
import knexConfig from '../database/knexfile';
import { Location } from '../Location/Location';

export const assembleReview = (reviews: any): Review[] => {
    return reviews.map((review: any) => {
        if (review.start && review.end) {
            const { start, end, ...rest } = review;
            return {
                ...rest,
                lease_term: { start_date: start, end_date: end },
            };
        }
        return review;
    });
};

export const assembleLocation = (raw: any): Location[] => {
    return raw.map((r: any) => {
        const { st_x, st_y, ...res } = r;
        return { coords: { lat: st_y, lng: st_x }, ...res };
    });
};

// export const assembleFlags = (raw: any): Flag[] => {
//     return raw.map((r: any) => {
//         const { category, topic, ...res } = r;
//         return { category: category, ...res };
//     });
// };

// used by migrations view
export function residenceColumns() {
    return [
        'residences.res_id',
        'loc_id',
        'unit',
        'residences.created_at',
        'residences.updated_at',
        'avg_rating',
        'avg_rent',
    ];
}
// used on residences_enhanced outer join locations
export function locationColumns() {
    const knx = knex(knexConfig as Knex.Config);
    const knexPostgis: KnexPostgis.KnexPostgis = KnexPostgis(knx);
    return [
        'loc_id',
        'google_place_id',
        'formatted_address',
        'category',
        'landlord_email',
        'geog',
        knexPostgis.x(knexPostgis.geometry('geog')),
        knexPostgis.y(knexPostgis.geometry('geog')),
        'created_at',
        'updated_at',
    ];
}

// used by review_db_handler, make a view for this too? with lease term
export function reviewColumns(this: postgresHandler) {
    return [
        'rev_id',
        'res_id',
        'user_id',
        'rating',
        'rent',
        'feedback',
        this.knex.raw('lower(lease_term) as start'),
        this.knex.raw('upper(lease_term) as end'),
        'created_at',
        'updated_at',
    ];
}
