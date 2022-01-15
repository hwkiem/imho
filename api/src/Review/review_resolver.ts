import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { postgresHandler } from '../dataSources/postgres';
import { ReviewQueryOptions, WriteReviewInput } from '../types/input_types';
import {
    FieldError,
    ReviewResponse,
    SingleReviewResponse,
} from '../types/object_types';
import { MyContext } from '../types/types';
import { Review } from './Review';

@Service()
@Resolver(Review)
export class ReviewResolver {
    constructor(private readonly pg: postgresHandler) {}
    @Mutation(() => SingleReviewResponse)
    async writeReview(
        @Arg('options') options: WriteReviewInput,
        @Ctx() { req }: MyContext
    ): Promise<SingleReviewResponse> {
        // user_id is allowed to be undefined, anon review
        const user_id = req.session.userId;
        // if (user_id === undefined) {
        //     return { errors: [{ field: 'session', message: 'not logged in' }] };
        // }
        // Validation
        // validate WriteReviewInput
        // const err = validateWriteReviewInput(options);
        // if (err) {
        //     return { errors: [err] };
        // }

        // ensure location exists
        // make category, landlord_email required?
        const loc_id = await this.pg.createLocationIfNotExists(
            options.google_place_id,
            options.category,
            options.landlord_email
        );
        if (loc_id instanceof FieldError) return { errors: [loc_id] };

        // ensure residence exists
        const res_id = await this.pg.createResidenceIfNotExists(
            loc_id,
            options.unit
        );
        if (res_id instanceof FieldError) return { errors: [res_id] };

        // write review
        const review = await this.pg.writeReview(
            res_id,
            options.review_input,
            user_id
        );
        if (review instanceof FieldError) return { errors: [review] };
        return review;
    }

    @Query(() => ReviewResponse)
    async getReviewsGeneric(
        @Arg('options', { nullable: true }) options: ReviewQueryOptions
    ): Promise<ReviewResponse> {
        return options
            ? await this.pg.getReviewsGeneric(
                  options.partial_review ? options.partial_review : undefined,
                  options.sort_params ? options.sort_params : undefined,
                  options.limit ? options.limit : undefined
              )
            : await this.pg.getReviewsGeneric();
    }

    @Query(() => ReviewResponse)
    async getReviewsByUserId(
        @Arg('user_ids', () => [Int]) ids: [number]
    ): Promise<ReviewResponse> {
        return await this.pg.getReviewsByUserId(ids);
    }

    @Query(() => ReviewResponse)
    async getReviewsByResidenceId(
        @Arg('residence_ids', () => [Int]) ids: [number]
    ): Promise<ReviewResponse> {
        return await this.pg.getReviewsByResidenceId(ids);
    }
}
