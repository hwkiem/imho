import { postgresHandler } from '../DataSources/postgres';
import { Review } from '../Review/reviews';
import KnexPostgis from 'knex-postgis';
import Knex from 'knex';
import knexConfig from '../database/knexfile';

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
    const knex = Knex(knexConfig as Knex.Config);
    const knexPostgis: KnexPostgis.KnexPostgis = KnexPostgis(knex);
    return [
        'loc_id',
        'google_place_id',
        'full_address',
        'street_num',
        'route',
        'city',
        'state',
        'postal_code',
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
        'res_id',
        'user_id',
        'rating',
        'rent',
        'air_conditioning',
        'heat',
        'stove',
        'pool',
        'gym',
        'garbage_disposal',
        'parking',
        'doorman',
        'laundry',
        'pet_friendly',
        'backyard',
        'bath_count',
        'bedroom_count',
        this.knex.raw('lower(lease_term_) as start'),
        this.knex.raw('upper(lease_term_) as end'),
        'created_at',
        'updated_at',
    ];
}
