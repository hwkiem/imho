import { postgresHandler } from '../dataSources/postgres';
import { WriteReviewInput } from '../types/input_types';
import { ReviewResponse } from '../types/object_types';
import { ReviewIdTuple } from '../types/types';
import { assembleReview } from '../utils/db_helper';
import { Review } from './reviews';

export async function writeReview(
    this: postgresHandler,
    input: WriteReviewInput
): Promise<ReviewResponse> {
    // nonsense require, but working
    var Range = require('pg-range').Range;
    // strip non-DB attr
    const { google_place_id, lease_term, ...args } = input;
    if (lease_term !== undefined) {
        args.lease_term_ = Range(lease_term.start_date, lease_term.end_date);
    }
    let r: ReviewResponse = {};
    await this.knex<Review>('reviews')
        .insert(args)
        .returning(['res_id', 'user_id'])
        .then(async (ids) => {
            console.log(ids);
            await this.getReviewsByPrimaryKeyTuple({
                res_id: ids[0].res_id,
                user_id: ids[0].user_id,
            })
                .then((res) => {
                    r = res;
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
    console.log('in');
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

export async function getReviewsObject(
    this: postgresHandler,
    obj: Partial<Review>,
    limit: number = 10
): Promise<ReviewResponse> {
    let r: ReviewResponse = {};
    await this.knex<Review>('reviews')
        .select(this.reviewColumns())
        .where(obj)
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
