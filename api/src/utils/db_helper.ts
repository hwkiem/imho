import { Review } from '../Review/reviews';
// import { StoveEnumConvert } from '../types/enum_types';

export const assembleReview = (reviews: any): Review[] => {
    return reviews.map((review: any) => {
        if (review.start && review.end) {
            const { start, end, ...rest } = review;
            return {
                ...rest,
                // stove: StoveEnumConvert(stove),
                lease_term: { start_date: start, end_date: end },
            };
        }
        return review;
    });
};
