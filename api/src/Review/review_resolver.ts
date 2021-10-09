import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import {
    AllAttributes,
    ReviewQueryOptions,
    WriteReviewInput,
} from '../types/input_types';
import {
    FieldError,
    ReviewResponse,
    SingleReviewResponse,
} from '../types/object_types';
import { MyContext } from '../types/types';
import { validateWriteReviewInput } from '../utils/validators';
import { Review } from './reviews';

@Resolver(Review)
export class ReviewResolver {
    @Mutation(() => SingleReviewResponse)
    async writeReview(
        @Arg('options') options: WriteReviewInput,
        @Ctx() { dataSources, req }: MyContext
    ): Promise<SingleReviewResponse> {
        // ensure user logged in
        const user_id = req.session.userId;
        if (user_id === undefined) {
            return { errors: [{ field: 'session', message: 'not logged in' }] };
        }
        // Validation
        const err = validateWriteReviewInput(options.review_details);
        if (err) {
            return { errors: [err] };
        }

        // ensure location exists
        const loc_id = await dataSources.pgHandler.createLocationIfNotExists(
            options.google_place_id
        );
        if (loc_id instanceof FieldError) return { errors: [loc_id] };

        // ensure residence exists
        const res_id = await dataSources.pgHandler.createResidenceIfNotExists(
            loc_id,
            options.unit
        );
        if (res_id instanceof FieldError) return { errors: [res_id] };

        // write review
        return await dataSources.pgHandler.writeReview(
            res_id,
            user_id,
            options.review_details
        );
    }

    @Query(() => ReviewResponse) // return number of rows returned? everywhere?
    async getReviewsGeneric(
        @Arg('options', { nullable: true }) options: ReviewQueryOptions,
        @Ctx() { dataSources }: MyContext
    ): Promise<ReviewResponse> {
        return options
            ? await dataSources.pgHandler.getReviewsGeneric(
                  options.partial_review ? options.partial_review : undefined,
                  options.sort_params ? options.sort_params : undefined,
                  options.limit ? options.limit : undefined
              )
            : await dataSources.pgHandler.getReviewsGeneric();
    }

    @Query(() => ReviewResponse)
    async getReviewsByUserId(
        @Arg('user_ids', () => [Int]) ids: [number],
        @Ctx() { dataSources }: MyContext
    ): Promise<ReviewResponse> {
        return await dataSources.pgHandler.getReviewsByUserId(ids);
    }

    @Query(() => ReviewResponse)
    async getReviewsByResidenceId(
        @Arg('residence_ids', () => [Int]) ids: [number],
        @Ctx() { dataSources }: MyContext
    ): Promise<ReviewResponse> {
        return await dataSources.pgHandler.getReviewsByResidenceId(ids);
    }

    @Mutation(() => SingleReviewResponse)
    async updateMyReviewOverwrite(
        @Arg('changes') changes: AllAttributes,
        @Arg('res_id') res_id: number,
        @Ctx() { req, dataSources }: MyContext
    ): Promise<SingleReviewResponse> {
        if (req.session.userId === undefined) {
            return { errors: [{ field: 'session', message: 'not logged in' }] };
        }
        // Validation
        const err = validateWriteReviewInput(changes);
        if (err) {
            return { errors: [err] };
        }
        return await dataSources.pgHandler.updateReviewGeneric(
            res_id,
            req.session.userId,
            changes
        );
    }

    @Mutation(() => ReviewResponse)
    async updateMyReviewGeneric(
        @Arg('changes') changes: AllAttributes,
        @Arg('res_id') res_id: number,
        @Ctx() { req, dataSources }: MyContext
    ) {
        if (req.session.userId === undefined) {
            return { errors: [{ field: 'session', message: 'not logged in' }] };
        }
        // Validation
        const err = validateWriteReviewInput(changes);
        if (err) {
            return { errors: [err] };
        }
        return await dataSources.pgHandler.updateReviewGeneric(
            res_id,
            req.session.userId,
            changes
        );
    }
}
