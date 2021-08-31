import { postgresHandler } from '../dataSources/postgres';
import { ReviewResponse, WriteReviewArgs } from '../types';
import { Review } from './reviews';

export async function writeReview(
    this: postgresHandler,
    input: WriteReviewArgs
): Promise<ReviewResponse> {
    let r: ReviewResponse = {};
    await this.knex<Review>('reviews')
        .insert(input)
        .returning('*')
        .then((reviews) => (r.reviews = reviews))
        .catch((e) => {
            if (e.code == 23505) {
                return {
                    errors: [
                        {
                            message: 'duplicate',
                            field: 'you have already reviewed this residency',
                        },
                    ],
                };
            }
            return (r.errors = [
                { field: 'insert review', message: e.toString() },
            ]);
        });
    return r;
}

export async function getReviewsByUserId(
    this: postgresHandler,
    ids: [number]
): Promise<ReviewResponse> {
    let r: ReviewResponse = {};
    await this.knex<Review>('reviews')
        .select('*')
        .where('user_id', 'in', ids)
        .then((reviews) => (r.reviews = reviews))
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
        .select('*')
        .where('res_id', 'in', ids)
        .then((reviews) => (r.reviews = reviews))
        .catch(
            (e) =>
                (r.errors = [{ field: 'query review', message: e.toString() }])
        );
    return r;
}

export async function getReviewsLimit(
    this: postgresHandler,
    limit: number
): Promise<ReviewResponse> {
    let r: ReviewResponse = {};
    await this.knex<Review>('reviews')
        .select('*')
        .limit(limit)
        .then((reviews) => (r.reviews = reviews))
        .catch(
            (e) =>
                (r.errors = [{ field: 'query review', message: e.toString() }])
        );
    return r;
}

export async function getReviewsObject(
    this: postgresHandler,
    obj: Partial<Review>
): Promise<ReviewResponse> {
    let r: ReviewResponse = {};
    await this.knex<Review>('reviews')
        .select('*')
        .where(obj)
        .then((reviews) => (r.reviews = reviews))
        .catch(
            (e) =>
                (r.errors = [{ field: 'query review', message: e.toString() }])
        );
    return r;
}
