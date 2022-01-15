import { postgresHandler } from '../dataSources/postgres';
import { QueryOrderChoice, ReviewSortBy } from '../types/enum_types';
import { ReviewFieldsInput, ReviewSortByInput } from '../types/input_types';
import { ReviewResponse, SingleReviewResponse } from '../types/object_types';
import { assembleReview } from '../utils/db_helper';
import { Review } from './Review';

export async function writeReview(
    this: postgresHandler,
    res_id: number,
    review_details: ReviewFieldsInput,
    user_id?: number | undefined
): Promise<SingleReviewResponse> {
    const r: SingleReviewResponse = {};

    // let rev_id: Pick<Review, 'rev_id'>;

    // transaction method needed higher up, to wrap location/residence/review creation
    // await this.knex
    //     .transaction(async (trx) => {
    //         // Insert review
    //         const ids = await trx<Review>('reviews')
    //             .insert({
    //                 res_id: res_id,
    //                 user_id: user_id,
    //                 ...attr,
    //             })
    //             .returning(['rev_id']);

    //         rev_id = ids[0];

    //         // Insert flags
    //         await trx('flags').insert([
    //             ...green_flags.map((e) => {
    //                 return { rev_id: ids[0].rev_id, topic: e.toString() };
    //             }),
    //             ...red_flags.map((e) => {
    //                 return { rev_id: ids[0].rev_id, topic: e.toString() };
    //             }),
    //         ]);
    //     })
    const args: Partial<Review> = {
        res_id: res_id,
        ...review_details.flags.cons,
        ...review_details.flags.pros,
        ...review_details.flags.dbks,
        feedback: review_details.feedback,
        rating: review_details.rating,
    };
    if (user_id) {
        // optional
        args.user_id = user_id;
    }
    await this.knex<Review>('reviews')
        .insert({
            ...args,
        })
        .returning('res_id')
        .then(async (rev_id) => {
            // Fetch review
            await this.getReviewsByReviewId([rev_id[0]])
                .then((res) => {
                    // assemble Flag from flattened DB
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

// export async function getReviewsByPrimaryKeyTuple(
//     this: postgresHandler,
//     user_id: number,
//     res_id: number
// ): Promise<ReviewResponse> {
//     const r: ReviewResponse = {};
//     await this.knex<Review>('reviews')
//         .select(this.reviewColumns())
//         .where('user_id', '=', user_id)
//         .where('res_id', '=', res_id)
//         .then((reviews) => {
//             r.reviews = assembleReview(reviews);
//         })
//         .catch((e) => {
//             r.errors = [{ field: 'query review', message: e.toString() }];
//         });
//     return r;
// }

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
    console.log('woah');
    const r: ReviewResponse = {};
    await this.knex<Review>('reviews')
        .select(this.reviewColumns())
        .where(obj)
        .whereNotNull(sort_params.attribute)
        .orderBy(sort_params.attribute, sort_params.sort)
        .limit(limit)
        .then((reviews) => {
            console.log(reviews, 'is raw');
            r.reviews = assembleReview(reviews);
            console.log(r.reviews, 'is review');
        })
        .catch(
            (e) =>
                (r.errors = [{ field: 'query review', message: e.toString() }])
        );
    console.log(r);
    return r;
}

export async function updateReviewGeneric(
    this: postgresHandler,
    rev_id: number,
    changes: Partial<Review>
): Promise<SingleReviewResponse> {
    const r: SingleReviewResponse = {};
    await this.knex<Review>('reviews')
        .update(changes)
        .where('rev_id', '=', rev_id)
        .returning(['rev_id'])
        .then(async (ids) => {
            await this.getReviewsByReviewId([ids[0].rev_id])
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
// export async function writeFlags(
//     this: postgresHandler,
//     rev_id: number,
// ): Promise<FieldError | null> {
//     let r: FieldError | null = null;
//     await this.knex('flags')
//         .insert([
//             ...green_flags.map((e) => {
//                 return { rev_id: rev_id, topic: e.toString() };
//             }),
//             ...red_flags.map((e) => {
//                 return { rev_id: rev_id, topic: e.toString() };
//             }),
//         ])
//         .catch((e) => {
//             r = { field: 'write flags', message: e.toString() };
//         });

//     return r;
// }

// export async function getReviewFlagsByType<T extends FlagTypeNames>(
//     this: postgresHandler,
//     rev_id: number,
//     topics: T
// ): Promise<FlagType<T>[] | FieldError> {
//     let r: FlagType<T>[] | FieldError = {
//         field: 'default',
//         message: 'default',
//     };
//     await this.knex<Flag>('flags')
//         .select('topic')
//         .where({ rev_id: rev_id })
//         .where(
//             'topic',
//             'in',
//             topics == 'RED'
//                 ? Object.keys(RedFlags)
//                 : topics == 'GREEN'
//                 ? Object.keys(GreenFlags)
//                 : [...Object.keys(RedFlags), ...Object.keys(GreenFlags)]
//         )
//         .then((t) => {
//             // hm
//             r = alignFlagTypes(t, topics) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
//         })
//         .catch(
//             (e) => (r = { field: 'query residence', message: e.toString() })
//         );

//     return r;
// }
