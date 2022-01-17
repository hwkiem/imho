import { Residence } from '../entities/Residence';
import { Review } from '../entities/Review';
import { Arg, Ctx, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { MyContext } from '../utils/context';
import { Place } from '../entities/Place';
import { WriteReviewValidator } from '../validators/WriteReviewValidator';
import { ApiResponse } from '../utils/types/Response';

@ObjectType()
class ReviewResponse extends ApiResponse(Review) {}

@Resolver(() => Review)
export class ReviewResolver {
    @Query(() => ReviewResponse)
    public async getReview(
        @Arg('id') id: string,
        @Ctx() ctx: MyContext
    ): Promise<ReviewResponse> {
        try {
            const place = await ctx.em.findOneOrFail(Review, {
                id: id,
            });
            return { result: place };
        } catch (e) {
            console.error(e);
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
        @Arg('input') input: WriteReviewValidator,
        @Ctx() { em }: MyContext
    ): Promise<ReviewResponse> {
        // does the place/residence exist?

        try {
            let place: Place | null = await em.findOne(Place, {
                google_place_id: input.placeValidator.google_place_id,
            });

            let residence: Residence | null = null;

            if (place == null) {
                // create place
                place = new Place(input.placeValidator);
                // no residence if no place, create
                residence = new Residence(input.residenceValidator);
            } else {
                // place existed, does residence
                residence = await em.findOne(Residence, {
                    unit: input.residenceValidator.unit,
                });
                if (residence == null) {
                    residence = new Residence(input.residenceValidator);
                }
            }

            const review = new Review(input.reviewValidator);
            console.log('Review Created');
            console.log(review);
            // add relationships
            residence.place = place;
            review.residence = residence;

            em.persist(review).persist(place).persist(residence).flush();
            console.log('Review Created');
            console.log(review);
            return { result: review };
        } catch (e) {
            console.log(e);
            return { errors: [{ field: 'unknown', error: e }] };
        }
    }
}
