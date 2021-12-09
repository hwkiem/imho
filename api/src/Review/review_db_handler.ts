import { postgresHandler } from '../dataSources/postgres';
import {
    GreenFlags,
    QueryOrderChoice,
    RedFlags,
    ReviewSortBy,
} from '../types/enum_types';
import { ReviewFieldsInput, ReviewSortByInput } from '../types/input_types';
import {
    FieldError,
    ReviewResponse,
    SingleReviewResponse,
} from '../types/object_types';
import { Flag, FlagType, FlagTypeNames } from '../types/types';
import { alignFlagTypes, assembleReview } from '../utils/db_helper';
import { Review } from './Review';

export async function writeReview(
    this: postgresHandler,
    res_id: number,
    user_id: number,
    review_details: ReviewFieldsInput
): Promise<SingleReviewResponse> {
    const { lease_term, green_flags, red_flags, ...attr } = review_details;
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
        .returning(['rev_id', 'res_id', 'user_id'])
        .then(async (ids) => {
            // NOTE
            // this just has to happen before fetching review, so flag arrays can be fetched
            await this.writeFlags(ids[0].rev_id, green_flags, red_flags);

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

// Flag operations

export async function writeFlags(
    this: postgresHandler,
    rev_id: number,
    green_flags: GreenFlags[],
    red_flags: RedFlags[]
): Promise<boolean | null> {
    console.log(green_flags, red_flags, rev_id);
    let b: boolean | null = null;
    console.log(
        ...green_flags.map((e) => {
            return { rev_id: rev_id, topic: e.toString() };
        })
    );
    await this.knex('flags')
        .insert([
            ...green_flags.map((e) => {
                return { rev_id: rev_id, topic: e.toString() };
            }),
            ...red_flags.map((e) => {
                return { rev_id: rev_id, topic: e.toString() };
            }),
        ])
        // .insert({
        //     rev_id: rev_id,
        //     green_flags: green_flags,
        //     red_flags: red_flags,
        // })
        .then(async () => {
            b = true;
            //     await this.getLocationsById(ids)
            //         .then((res) => {
            //             if (res.locations) r.location = res.locations[0];
            //         })
            //         .catch(
            //             (e) =>
            //                 (r.errors = [
            //                     {
            //                         field: 'fetch location',
            //                         message: e.toString(),
            //                     },
            //                 ])
            //         );
        })
        .catch(() => {
            b = false;
            // dup place_id
            // if (e.code == 23505) {
            //     r.errors = [
            //         {
            //             field: 'create location',
            //             message: 'this location already exists',
            //         },
            //     ];
            // } else {
            //     r.errors = [
            //         { field: 'create location', message: e.toString() },
            //     ];
            // }
        });

    console.log(b);
    return b;
}

export async function getReviewFlagsByType<T extends FlagTypeNames>(
    this: postgresHandler,
    rev_id: number,
    topics: T
): Promise<FlagType<T>[] | FieldError> {
    let r: FlagType<T>[] | FieldError = {
        field: 'default',
        message: 'not reassigned',
    };
    await this.knex<Flag>('flags')
        .select('topic')
        .where({ rev_id: rev_id })
        .where(
            'topic',
            'in',
            topics == 'RED'
                ? Object.keys(RedFlags)
                : topics == 'GREEN'
                ? Object.keys(GreenFlags)
                : [...Object.keys(RedFlags), ...Object.keys(GreenFlags)]
        )
        .then((t) => {
            // hm
            r = alignFlagTypes(t, topics) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
        })
        .catch(
            (e) => (r = { field: 'query residence', message: e.toString() })
        );

    return r;
}
