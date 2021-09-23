import { postgresHandler } from '../DataSources/postgres';
import { QueryOrderChoice, ReviewSortBy } from '../types/enum_types';
import { ReviewSortByInput, WriteReviewInput } from '../types/input_types';
import { ReviewResponse, SingleReviewResponse } from '../types/object_types';
import { ReviewIdTuple } from '../types/types';
import { assembleReview } from '../utils/db_helper';
import { Review } from './reviews';

export async function writeReview(
    this: postgresHandler,
    input: WriteReviewInput
): Promise<SingleReviewResponse> {
    // nonsense require, but working
    var Range = require('pg-range').Range;
    // strip non-DB attr
    const { google_place_id, lease_term, ...args } = input;
    if (lease_term !== undefined) {
        args.lease_term_ = Range(lease_term.start_date, lease_term.end_date);
    }
    let r: SingleReviewResponse = {};
    await this.knex<Review>('reviews')
        .insert(args)
        .returning(['res_id', 'user_id'])
        .then(async (ids) => {
            await this.getReviewsByPrimaryKeyTuple({
                res_id: ids[0].res_id,
                user_id: ids[0].user_id,
            })
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
                        message: 'you have already reviewed this residency',
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
    ids: ReviewIdTuple
): Promise<ReviewResponse> {
    let r: ReviewResponse = {};
    await this.knex<Review>('reviews')
        .select(this.reviewColumns())
        .where('user_id', '=', ids.user_id)
        .where('res_id', '=', ids.res_id)
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
    let r: ReviewResponse = {};
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
    let r: ReviewResponse = {};
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
    limit: number = 10
): Promise<ReviewResponse> {
    let r: ReviewResponse = {};
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
    let r: SingleReviewResponse = {};
    await this.knex<Review>('reviews')
        .update(changes)
        .where('res_id', '=', res_id)
        .where('user_id', '=', user_id)
        .returning(['user_id', 'res_id'])
        .then(async (ids) => {
            await this.getReviewsByPrimaryKeyTuple({
                res_id: ids[0].res_id,
                user_id: ids[0].user_id,
            })
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
