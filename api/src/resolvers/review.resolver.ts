import { Residence } from '../entities/Residence';
import { Review } from '../entities/Review';
import { Arg, Ctx, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { MyContext } from '../utils/context';
import { Place } from '../entities/Place';
import { WriteReviewInput } from '../validators/WriteReviewInput';
import { ApiResponse } from '../utils/types/Response';
import { ImhoUser } from '../entities/ImhoUser';

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
        @Arg('input') input: WriteReviewInput,
        @Ctx() { em, req }: MyContext
    ): Promise<ReviewResponse> {
        try {
            const place: Place = await em.findOneOrFail(Place, {
                google_place_id: input.placeInput.google_place_id,
            });

            try {
                const residence = await em.findOneOrFail(Residence, {
                    unit: input.residenceInput.unit
                        ? input.residenceInput.unit
                        : 'single', // default value
                });

                console.log('place and location already  exist');
                // place and residence exist, create review
                const review = new Review(input.reviewInput);
                // add relationships
                residence.place = place;
                review.residence = residence;
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

                em.persist(review).persist(place).persist(residence).flush();
                return { result: review };
            } catch (e) {
                console.log(e);
                const residence = new Residence(input.residenceInput);
                // place and residence exist, create review
                const review = new Review(input.reviewInput);
                // add relationships
                residence.place = place;
                review.residence = residence;
                if (req.session.userId) {
                    try {
                        const user = await em.findOneOrFail(ImhoUser, {
                            id: req.session.userId,
                        });
                        review.author = user;
                    } catch {
                        console.log('could not fetch author account');
                    }
                }
                em.persist(review).persist(place).persist(residence).flush();
                return { result: review };
            }
        } catch (e) {
            console.log('place did not exist');
            console.log(e);
            const place = new Place(input.placeInput);
            const residence = new Residence(input.residenceInput);
            // place and residence exist, create review
            const review = new Review(input.reviewInput);
            // add relationships
            residence.place = place;
            review.residence = residence;
            if (req.session.userId) {
                try {
                    const user = await em.findOneOrFail(ImhoUser, {
                        id: req.session.userId,
                    });
                    review.author = user;
                } catch {
                    console.log('could not fetch author account');
                }
            }
            em.persist(review).persist(place).persist(residence).flush();
            return { result: review };
        }
    }
}
