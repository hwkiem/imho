import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { PartialReview, WriteReviewInput } from '../types/input_types';
import {
    FieldError,
    ResidenceResponse,
    ReviewResponse,
} from '../types/object_types';
import { MyContext } from '../types/types';
import { Review } from './reviews';

@Resolver(Review)
export class ReviewResolver {
    @Mutation(() => ReviewResponse)
    async writeReview(
        @Arg('options') options: WriteReviewInput,
        @Ctx() { dataSources, req }: MyContext
    ): Promise<ReviewResponse> {
        if (req.session.userId === undefined) {
            return { errors: [{ field: 'session', message: 'not logged in' }] };
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
        // let args: WriteReviewArgs;
        if (getResponse.residences.length == 0) {
            // residence does not exist, create
            const locationResult =
                await dataSources.googleMapsHandler.locationFromPlaceID(
                    options.google_place_id
                );
            if (locationResult instanceof FieldError) {
                return { errors: [locationResult] };
            }
            const createResponse = await dataSources.pgHandler.createResidence(
                locationResult,
                {
                    google_place_id: options.google_place_id,
                }
            );
            if (createResponse.errors || !createResponse.residences) {
                return { errors: createResponse.errors };
            }
            options.user_id = req.session.userId;
            options.res_id = createResponse.residences[0].res_id;
        } else {
            // residence exists
            options.user_id = req.session.userId;
            options.res_id = getResponse.residences[0].res_id;
        }
        if (options.bath_count && options.bath_count % 0.5 != 0) {
            return {
                errors: [
                    { field: 'bath_count', message: 'incremenets of .5!' },
                ],
            };
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

    @Mutation(() => ReviewResponse)
    async updateMyReviewGeneric(
        @Arg('changes') changes: PartialReview,
        @Arg('res_id') res_id: number,
        @Ctx() { req, dataSources }: MyContext
    ) {
        if (req.session.userId === undefined) {
            return { errors: [{ field: 'session', message: 'not logged in' }] };
        }
        return await dataSources.pgHandler.updateReviewGeneric(
            res_id,
            req.session.userId,
            changes
        );
    }
}
