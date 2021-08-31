import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Review } from './reviews';
import {
    MyContext,
    PartialReview,
    ResidenceResponse,
    WriteReviewArgs,
} from '../types';
import { ReviewResponse, WriteReviewInput } from '../types';

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
        let args: WriteReviewArgs;
        if (getResponse.residences.length == 0) {
            // residence does not exist, create
            const createResponse = await dataSources.pgHandler.createResidence(
                {
                    google_place_id: options.google_place_id,
                },
                dataSources.googleMapsHandler.locationFromPlaceID
            );
            if (createResponse.errors || !createResponse.residences) {
                return { errors: createResponse.errors };
            }
            args = {
                user_id: req.session.userId,
                res_id: createResponse.residences[0].res_id,
            };
        } else {
            // residence exists
            args = {
                user_id: req.session.userId,
                res_id: getResponse.residences[0].res_id,
            };
        }
        // fill optional args
        if (options.rating !== undefined) {
            args.rating = options.rating;
        }
        if (options.rent !== undefined) {
            args.rent = options.rent;
        }
        const response = await dataSources.pgHandler.writeReview(args);
        return response;
    }

    // write update rating

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

    @Query(() => ReviewResponse)
    async getReviewsLimit(
        @Arg('limit', () => Int) limit: number,
        @Ctx() { dataSources }: MyContext
    ): Promise<ReviewResponse> {
        return await dataSources.pgHandler.getReviewsLimit(limit);
    }

    @Query(() => ReviewResponse) // return number of rows returned? everywhere?
    async getReviewsObjFilter(
        @Arg('obj') obj: PartialReview,
        @Ctx() { dataSources }: MyContext
    ): Promise<ReviewResponse> {
        return await dataSources.pgHandler.getReviewsObject(obj);
    }
}
