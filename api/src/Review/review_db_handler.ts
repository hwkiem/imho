import { postgresHandler } from '../dataSources/postgres';
import { QueryOrderChoice, ReviewSortBy } from '../types/enum_types';
import { ReviewSortByInput } from '../types/input_types';
import { ReviewResponse, SingleReviewResponse } from '../types/object_types';
import { ReviewFields } from '../types/types';
import { assembleReview } from '../utils/db_helper';
import { Review } from './Review';

export async function writeReview(
    this: postgresHandler,
    res_id: number,
    user_id: number,
    review_details: ReviewFields
): Promise<SingleReviewResponse> {
    const { lease_term, ...attr } = review_details;
    const r: SingleReviewResponse = {};
    await this.knex<Review>('reviews')
        .insert({
            res_id: res_id,
            user_id: user_id,
            ...attr,
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            lease_term: require('pg-range').Range(
                lease_term.start_date,
                lease_term.end_date
            ),
        })
        .returning(['res_id', 'user_id'])
        .then(async (ids) => {
            await this.getReviewsByPrimaryKeyTuple(
                ids[0].user_id,
                ids[0].res_id
            )
                .then((res) => {
                    if (res.reviews) r.review = res.reviews[0];
                })
                .catch((e) => {
                    r.errors = [
                        {
                            field: 'fetch review',
                            message: e.toString(),
                        },
                    ];
                });
        })
        .catch((e) => {
            if (e.code == 23505) {
                r.errors = [
                    {
                        field: 'duplicate',
                        message: 'you have already reviewed this residence',
                    },
                ];
            } else if (e.code == 23503) {
                r.errors = [
                    {
                        field: 'user',
                        message: 'user does not exist, cannot review',
                    },
                ];
            } else {
                r.errors = [{ field: 'insert review', message: e.toString() }];
            }
        });
    return r;
}

export async function getReviewsByPrimaryKeyTuple(
    this: postgresHandler,
    user_id: number,
    res_id: number
): Promise<ReviewResponse> {
    const r: ReviewResponse = {};
    await this.knex<Review>('reviews')
        .select(this.reviewColumns())
        .where('user_id', '=', user_id)
        .where('res_id', '=', res_id)
        .then((reviews) => {
            r.reviews = assembleReview(reviews);
        })
        .catch((e) => {
            r.errors = [{ field: 'query review', message: e.toString() }];
        });
    return r;
}

export async function getReviewsByReviewId(
    this: postgresHandler,
    rev_id: [number]
): Promise<ReviewResponse> {
    const r: ReviewResponse = {};
    await this.knex<Review>('reviews')
        .select(this.reviewColumns())
        .where('rev_id', 'in', rev_id)
        .then((reviews) => {
            r.reviews = assembleReview(reviews);
        })
        .catch((e) => {
            r.errors = [{ field: 'query review', message: e.toString() }];
        });
    return r;
}

export async function getReviewsByUserId(
    this: postgresHandler,
    ids: [number]
): Promise<ReviewResponse> {
    const r: ReviewResponse = {};
    await this.knex<Review>('reviews')
        .select(this.reviewColumns())
        .where('user_id', 'in', ids)
        .then((reviews) => {
            r.reviews = assembleReview(reviews);
        })
        .catch(
            (e) =>
                (r.errors = [{ field: 'query review', message: e.toString() }])
        );
    return r;
}

export async function getReviewsByResidenceId(
    this: postgresHandler,
    ids: [number]
): Promise<ReviewResponse> {
    const r: ReviewResponse = {};
    await this.knex<Review>('reviews')
        .select(this.reviewColumns())
        .where('res_id', 'in', ids)
        .then((reviews) => {
            r.reviews = assembleReview(reviews);
        })
        .catch(
            (e) =>
                (r.errors = [{ field: 'query review', message: e.toString() }])
        );
    return r;
}

export async function getReviewsGeneric(
    this: postgresHandler,
    obj: Partial<Review> = {},
    sort_params: ReviewSortByInput = {
        attribute: ReviewSortBy.USER_ID,
        sort: QueryOrderChoice.ASC,
    },
    limit = 10
): Promise<ReviewResponse> {
    const r: ReviewResponse = {};
    await this.knex<Review>('reviews')
        .select(this.reviewColumns())
        .where(obj)
        .whereNotNull(sort_params.attribute)
        .orderBy(sort_params.attribute, sort_params.sort)
        .limit(limit)
        .then((reviews) => {
            r.reviews = assembleReview(reviews);
        })
        .catch(
            (e) =>
                (r.errors = [{ field: 'query review', message: e.toString() }])
        );
    return r;
}

export async function updateReviewGeneric(
    this: postgresHandler,
    res_id: number,
    user_id: number,
    changes: Partial<Review>
): Promise<SingleReviewResponse> {
    const r: SingleReviewResponse = {};
    await this.knex<Review>('reviews')
        .update(changes)
        .where('res_id', '=', res_id)
        .where('user_id', '=', user_id)
        .returning(['user_id', 'res_id'])
        .then(async (ids) => {
            await this.getReviewsByPrimaryKeyTuple(
                ids[0].user_id,
                ids[0].res_id
            )
                .then((reviews) => {
                    if (reviews.reviews) r.review = reviews.reviews[0];
                })
                .catch((e) => {
                    r.errors = [
                        { field: 'update review', message: e.toString() },
                    ];
                });
        })
        .catch(
            (e) =>
                (r.errors = [{ field: 'update review', message: e.toString() }])
        );
    return r;
}
