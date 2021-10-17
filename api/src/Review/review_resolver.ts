import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { postgresHandler } from '../dataSources/postgres';
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
        const loc_id = await this.pg.createLocationIfNotExists(
            options.google_place_id
        );
        if (loc_id instanceof FieldError) return { errors: [loc_id] };

        // ensure residence exists
        const res_id = await this.pg.createResidenceIfNotExists(
            loc_id,
            options.unit
        );
        if (res_id instanceof FieldError) return { errors: [res_id] };

        // write review
        return await this.pg.writeReview(
            res_id,
            user_id,
            options.review_details
        );
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

    @Mutation(() => SingleReviewResponse)
    async updateMyReviewOverwrite(
        @Arg('changes') changes: AllAttributes,
        @Arg('res_id') res_id: number,
        @Ctx() { req }: MyContext
    ): Promise<SingleReviewResponse> {
        if (req.session.userId === undefined) {
            return { errors: [{ field: 'session', message: 'not logged in' }] };
        }
        // Validation
        const err = validateWriteReviewInput(changes);
        if (err) {
            return { errors: [err] };
        }
        return await this.pg.updateReviewGeneric(
            res_id,
            req.session.userId,
            changes
        );
    }
}
