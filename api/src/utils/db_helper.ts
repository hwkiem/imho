import { postgresHandler } from '../dataSources/postgres';
import { Review } from '../Review/Review';
import { Location } from '../Location/Location';
import { ConsType, DbksType, ProsType } from '../types/flags';

export const assembleReview = (reviews: any): Review[] => {
    return reviews.map((review: any) => {
        const pros: ProsType = {
            amenities: review.amenities,
            appliances: review.appliances,
            good_landlord: review.good_landlord,
            natural_light: review.natural_light,
            neighborhood: review.neighborhood,
            pet_friendly: review.pet_friendly,
            storage: review.storage,
        };
        const cons: ConsType = {
            safety: review.safety,
            bad_landlord: review.amenities,
            pet_unfriendly: review.appliances,
            shower: review.good_landlord,
            false_advertisement: review.natural_light,
            noise: review.neighborhood,
            mold_or_mildew: review.pet_friendly,
            pests: review.storage,
            maintanence_issues: review.storage,
            connectivity: review.storage,
        };
        const dbks: DbksType = {
            security_deposit: review.amenities,
            lease_issues: review.appliances,
            burglary: review.good_landlord,
            construction_harrassment: review.natural_light,
            unresponsiveness: review.neighborhood,
            privacy: review.pet_friendly,
        };
        const {
            rev_id,
            user_id,
            res_id,
            rating,
            feedback,
            created_at,
            updated_at,
        } = review;
        return {
            rev_id,
            user_id,
            res_id,
            rating,
            feedback,
            created_at,
            updated_at,
            flags: { pros: pros, cons: cons, dbks: dbks },
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

// used by review_db_handler
// oof this needs revamp
export function reviewColumns(this: postgresHandler) {
    return [
        'rev_id',
        'res_id',
        'user_id',
        'appliances',
        'natural_light',
        'neighborhood',
        'amenities',
        'good_landlord',
        'pet_friendly',
        'storage',
        'bad_landlord',
        'pet_unfriendly',
        'shower',
        'false_advertisement',
        'noise',
        'mold_or_mildew',
        'pests',
        'maintanence_issues',
        'connectivity',
        'safety',
        'security_deposit',
        'lease_issues',
        'burglary',
        'construction_harrassment',
        'unresponsiveness',
        'privacy',

        'rating',
        'feedback',

        'created_at',
        'updated_at',
    ];
}
