import { ObjectType, Field, Float, Root, Arg } from 'type-graphql';
import Container from 'typedi';
import { postgresHandler } from '../dataSources/postgres';
import { Review } from '../Review/Review';
import { LaundryType, StoveType } from '../types/enum_types';
import { ReviewQueryOptions } from '../types/input_types';

@ObjectType()
export class Residence {
    @Field()
    res_id: number;

    @Field()
    loc_id: number;

    @Field()
    unit: string;

    // aggregates
    // averages
    @Field(() => Float, { nullable: true })
    avg_rating?: number;

    @Field(() => Float, { nullable: true })
    avg_rent?: number;

    // modes
    @Field({ nullable: true })
    air_conditioning?: boolean;

    @Field({ nullable: true })
    heat?: boolean;

    @Field(() => StoveType, { nullable: true })
    stove?: StoveType;

    @Field({ nullable: true })
    pool?: boolean;

    @Field({ nullable: true })
    gym?: boolean;

    @Field({ nullable: true })
    garbage_disposal?: boolean;

    @Field({ nullable: true })
    dishwasher?: boolean;

    @Field({ nullable: true })
    parking?: boolean;

    @Field({ nullable: true })
    doorman?: boolean;

    @Field({ nullable: true })
    pet_friendly?: boolean;

    @Field(() => LaundryType, { nullable: true })
    laundry?: LaundryType;

    @Field({ nullable: true })
    backyard?: boolean;

    @Field(() => Float, { nullable: true })
    bath_count?: number;

    @Field({ nullable: true })
    bedroom_count?: number;

    //

    @Field(() => [Review], { nullable: true })
    async myReviews(
        @Root() residence: Residence,
        @Arg('options', { nullable: true }) options: ReviewQueryOptions
    ): Promise<Review[] | undefined> {
        const pg = Container.get(postgresHandler);
        const res = options
            ? await pg.getReviewsGeneric(
                  options.partial_review
                      ? {
                            ...options.partial_review,
                            res_id: residence.res_id,
                        }
                      : { res_id: residence.res_id },
                  options.sort_params ? options.sort_params : undefined,
                  options.limit ? options.limit : undefined
              )
            : await pg.getReviewsGeneric({
                  res_id: residence.res_id,
              });

        if (!res.errors && res.reviews) {
            return res.reviews;
        }
        return;
    }

    @Field(() => String)
    created_at = new Date();

    @Field(() => String)
    updated_at = new Date();
}
