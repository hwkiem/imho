import { postgresHandler } from '../dataSources/postgres';
import { Review } from '../Review/Review';
import { Location } from '../Location/Location';

export const assembleReview = (reviews: any): Review[] => {
    return reviews.map((review: any) => {
        const { start, end, ...rest } = review;
        return {
            ...rest,
            lease_term: { start_date: start, end_date: end },
        };
    });
};

// has to happen to nest coords object
export const assembleLocation = (raw: any): Location[] => {
    return raw.map((r: any) => {
        const { lat, lng, ...res } = r;
        return { coords: { lat: lat, lng: lng }, ...res };
    });
};

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
