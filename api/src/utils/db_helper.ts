import { postgresHandler } from '../DataSources/postgres';
import { Review } from '../Review/reviews';

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

export function residenceColumns(this: postgresHandler) {
    return [
        'residences.res_id',
        'google_place_id',
        'full_address',
        'apt_num',
        'street_num',
        'route',
        'city',
        'state',
        'postal_code',
        this.knexPostgis.x(this.knexPostgis.geometry('geog')),
        this.knexPostgis.y(this.knexPostgis.geometry('geog')),
        this.knex.avg('rating').as('avg_rating'),
        this.knex.avg('rent').as('avg_rent'),
        'residences.created_at',
        'residences.updated_at',
    ];
}

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
        'recommend_score',
        this.knex.raw('lower(lease_term_) as start'),
        this.knex.raw('upper(lease_term_) as end'),
        'created_at',
        'updated_at',
    ];
}

//should be able to pull off higher order functions
// export function selectResidence(base: Knex<Residence>) {
//     return () =>
//         base.select([
//             'residences.res_id',
//             'google_place_id',
//             'full_address',
//             'apt_num',
//             'street_num',
//             'route',
//             'city',
//             'state',
//             'postal_code',
//             this.knexPostgis.x(this.knexPostgis.geometry('geog')),
//             this.knexPostgis.y(this.knexPostgis.geometry('geog')),
//             this.knex.avg('rating').as('avg_rating'),
//             this.knex.avg('rent').as('avg_rent'),
//             'residences.created_at',
//             'residences.updated_at',
//         ]);
// }
