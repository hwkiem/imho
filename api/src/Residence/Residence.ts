import { ObjectType, Field, Float, Root, Arg } from 'type-graphql';
import Container from 'typedi';
import { postgresHandler } from '../dataSources/postgres';
import { Review } from '../Review/Review';
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

    // Field Resolvers
    @Field(() => [Review], { nullable: true })
    async reviews(
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

    // // Field Resolvers
    // @Field(() => Int, { nullable: true })
    // async count(@Root() residence: Residence): Promise<number | undefined> {
    //     const pg = Container.get(postgresHandler);
    //     // const count = pg.getReviewsCountGeneric({})
    //     const count = await pg.getReviewsCountGeneric({
    //         res_id: residence.res_id,
    //     });

    //     if (!res.errors && res.reviews) {
    //         return res.reviews;
    //     }
    //     return;
    // }

    @Field(() => String)
    created_at = new Date();

    @Field(() => String)
    updated_at = new Date();
}
