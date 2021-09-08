import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { PartialReview, WriteReviewInput } from '../types/input_types';
import {
    FieldError,
    ResidenceResponse,
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
        if (req.session.userId === undefined) {
            return { errors: [{ field: 'session', message: 'not logged in' }] };
        }
        // Validation
        const err = validateWriteReviewInput(options);
        if (err) {
            return { errors: [err] };
        }
        // does the residence already exist?
        const getResponse: ResidenceResponse =
            await dataSources.pgHandler.getResidencesObject({
                google_place_id: options.google_place_id,
            });
        if (
            getResponse.errors !== undefined ||
            getResponse.residences === undefined
        ) {
            return { errors: getResponse.errors };
        }
        if (getResponse.residences.length == 0) {
            // residence does not exist
            //
            const locationResult =
                await dataSources.googleMapsHandler.locationFromPlaceID(
                    options.google_place_id
                );
            if (locationResult instanceof FieldError) {
                return { errors: [locationResult] };
            }
            //create
            const createResponse = await dataSources.pgHandler.createResidence(
                locationResult,
                {
                    google_place_id: options.google_place_id,
                }
            );
            if (createResponse.errors || !createResponse.residence) {
                return { errors: createResponse.errors };
            }
            options.user_id = req.session.userId;
            options.res_id = createResponse.residence.res_id;
        } else {
            // residence exists
            options.user_id = req.session.userId;
            options.res_id = getResponse.residences[0].res_id;
        }
        const response = await dataSources.pgHandler.writeReview(options);
        return response;
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

    @Query(() => ReviewResponse) // return number of rows returned? everywhere?
    async getReviewsObjFilter(
        @Arg('obj') obj: PartialReview,
        @Arg('limit', () => Int, { nullable: true }) limit: number,
        @Ctx() { dataSources }: MyContext
    ): Promise<ReviewResponse> {
        return await dataSources.pgHandler.getReviewsObject(obj, limit);
    }

    @Mutation(() => SingleReviewResponse)
    async updateMyReviewGeneric(
        @Arg('changes') changes: PartialReview,
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
}
