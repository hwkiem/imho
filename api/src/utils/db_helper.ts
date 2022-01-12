import { postgresHandler } from '../dataSources/postgres';
import { Review } from '../Review/Review';
import { Location } from '../Location/Location';
import { Flag, FlagType, FlagTypeNames } from '../types/types';
import { GreenFlags, RedFlags } from '../types/enum_types';

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
        const { lat, lng, ...rest } = r;
        return { coords: { lat: lat, lng: lng }, ...rest };
    });
};

//
export function alignFlagTypes(
    topics: Pick<Flag, 'topic'>[],
    type: FlagTypeNames
): FlagType<typeof type>[] {
    switch (type) {
        case 'GREEN':
            return topics.map((pick) => {
                return GreenFlags[pick.topic as keyof typeof GreenFlags];
            });
        case 'RED':
            return topics.map((pick) => {
                return RedFlags[pick.topic as keyof typeof RedFlags];
            });
        default:
            return [];
    }
}

// used by review_db_handler
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
