import { Review } from '../entities/Review';
import { Arg, Ctx, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { MyContext } from '../utils/context';
import { WriteReviewInput } from '../validators/WriteReviewInput';
import { ApiResponse, SuccessResponse } from '../utils/types/Response';
import { ImhoUser } from '../entities/ImhoUser';
import { Service } from 'typedi';
import {
    createPlaceIfNotExists,
    createResidenceIfNotExists,
} from '../utils/createIfNotExists';
import { CreateReviewInput } from '../validators/ReviewValidator';

@ObjectType()
class ReviewResponse extends ApiResponse(Review) {}

@Service()
@Resolver(() => Review)
export class ReviewResolver {
    @Query(() => ReviewResponse)
    public async getReview(
        @Arg('id') id: string,
        @Ctx() ctx: MyContext
    ): Promise<ReviewResponse> {
        try {
            const review = await ctx.em.findOneOrFail(Review, {
                id: id,
            });
            return { result: review };
        } catch (e) {
            // console.error(e);
            return {
                errors: [
                    {
                        field: 'id',
                        error: 'Could not find matching review.',
                    },
                ],
            };
        }
    }

    @Mutation(() => ReviewResponse)
    public async addReview(
        @Arg('input') input: WriteReviewInput,
        @Ctx() { em, req }: MyContext
    ): Promise<ReviewResponse> {
        // make sure review.flags are unique from client
        input.reviewInput.flagInput = {
            pros: [...new Set(input.reviewInput.flagInput.pros)],
            cons: [...new Set(input.reviewInput.flagInput.cons)],
            dbks: [...new Set(input.reviewInput.flagInput.dbks)],
        };

        // ensure place, residence
        const placeResponse = await createPlaceIfNotExists(
            em,
            input.placeInput
        );
        if (placeResponse.errors || placeResponse.result === undefined)
            return { errors: placeResponse.errors };
        const place = placeResponse.result;

        const residenceResponse = await createResidenceIfNotExists(
            em,
            place,
            input.residenceInput
        );
        if (residenceResponse.errors || residenceResponse.result === undefined)
            return { errors: residenceResponse.errors };
        const residence = residenceResponse.result;

        // create new review
        const review = new Review(input.reviewInput);
        review.flag_string = JSON.stringify(input.reviewInput.flagInput);

        // add user to review if on session
        if (req.session.userId) {
            try {
                review.author = await em.findOneOrFail(ImhoUser, {
                    id: req.session.userId,
                });
            } catch {
                // but still make the review without the user
                console.log('could not fetch author account');
            }
        }

        // place and residence exist, add relationships
        residence.place = place;
        review.residence = residence;
        try {
            await em.persist(review).persist(place).persist(residence).flush();
        } catch (e) {
            if (e.code == 23505) {
                return {
                    errors: [
                        {
                            field: 'insert review',
                            error: 'you already reviewed this residence',
                        },
                    ],
                };
            }
            // return { errors: [{ field: 'insert data', error: e.toString() }] };
        }
        return { result: review };
    }

    @Mutation(() => SuccessResponse)
    public async deleteReview(
        @Arg('reviewId') reviewId: string,
        @Ctx() { em, req }: MyContext
    ): Promise<SuccessResponse> {
        try {
            const review = await em.findOneOrFail(Review, { id: reviewId });
            if (review.author) {
                if (req.session.userId === null) {
                    return {
                        result: false,
                        errors: [
                            {
                                field: 'session',
                                error: 'this review has an author and you are not logged in',
                            },
                        ],
                    };
                }
                if (review.author.id === req.session.userId) {
                    await em.remove(review).flush();
                    return { result: true };
                }
                return {
                    result: false,
                    errors: [
                        {
                            field: 'session',
                            error: 'you are not the author of this review',
                        },
                    ],
                };
            }

            // review has no author, for now allow deletion
            await em.remove(review).flush();
            return { result: true };
        } catch {
            return {
                result: false,
                errors: [
                    {
                        field: 'reviewId',
                        error: 'no review exists with this id',
                    },
                ],
            };
        }
    }
    @Mutation(() => ReviewResponse)
    public async editReview(
        @Arg('input') input: CreateReviewInput,
        @Arg('reviewId') reviewId: string,
        @Ctx() { em, req }: MyContext
    ): Promise<ReviewResponse> {
        // make sure review.flags are unique from client
        input.flagInput = {
            pros: [...new Set(input.flagInput.pros)],
            cons: [...new Set(input.flagInput.cons)],
            dbks: [...new Set(input.flagInput.dbks)],
        };

        try {
            const review = await em.findOneOrFail(Review, { id: reviewId });
            if (review.author) {
                if (req.session.userId === null) {
                    return {
                        errors: [
                            {
                                field: 'session',
                                error: 'this review has an author and you are not logged in',
                            },
                        ],
                    };
                }
                if (review.author.id === req.session.userId) {
                    review.assign(input);
                    review.flag_string = JSON.stringify(input.flagInput);
                    em.persistAndFlush(review);
                    return { result: review };
                }
                return {
                    errors: [
                        {
                            field: 'session',
                            error: 'you are not the author of this review',
                        },
                    ],
                };
            }

            // review has no author, for now allow edits
            review.assign(input);
            review.flag_string = JSON.stringify(input.flagInput);
            em.persistAndFlush(review);

            return { result: review };
        } catch {
            return {
                errors: [
                    {
                        field: 'reviewId',
                        error: 'no review exists with this id',
                    },
                ],
            };
        }
    }
}
