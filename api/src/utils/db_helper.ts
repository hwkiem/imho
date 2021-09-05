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
