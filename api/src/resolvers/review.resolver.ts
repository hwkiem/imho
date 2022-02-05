import { Residence, SINGLE_FAMILY } from '../entities/Residence';
import { Review } from '../entities/Review';
import { Arg, Ctx, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { MyContext } from '../utils/context';
import { Place } from '../entities/Place';
import { WriteReviewInput } from '../validators/WriteReviewInput';
import { ApiResponse } from '../utils/types/Response';
import { ImhoUser } from '../entities/ImhoUser';
import { Service } from 'typedi';

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
        let place: Place;
        let residence: Residence;
        try {
            place = await em.findOneOrFail(Place, {
                google_place_id: input.placeInput.google_place_id,
            });

            try {
                residence = await em.findOneOrFail(Residence, {
                    unit: input.residenceInput.unit
                        ? input.residenceInput.unit
                        : SINGLE_FAMILY,
                    place: place,
                });
                console.log('found a residence:', residence);
            } catch (e) {
                residence = new Residence(input.residenceInput);
                console.log('made a new residence:', residence);
            }
        } catch (e) {
            // place does not exist, residence cannot exist, create both
            place = new Place(input.placeInput);
            residence = new Residence(input.residenceInput);
        }

        if (place === undefined) {
            return {
                errors: [
                    {
                        field: 'place',
                        error: 'Could not find place. Review creation failed.',
                    },
                ],
            };
        }
        if (residence === undefined) {
            return {
                errors: [
                    {
                        field: 'residence',
                        error: 'Could not find residence. Review creation failed.',
                    },
                ],
            };
        }

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
}
