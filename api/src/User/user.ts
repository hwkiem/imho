import { ObjectType, Field, Ctx, Arg } from 'type-graphql';
import { Review } from '../Review/Review';
import { QueryOrderChoice, ReviewSortBy } from '../types/enum_types';
import { ReviewQueryOptions } from '../types/input_types';
import { MyContext } from '../types/types';

@ObjectType()
export class User {
    @Field()
    user_id: number;

    @Field()
    first_name: string;

    @Field()
    last_name: string;

    @Field()
    email: string;

    @Field({ nullable: true })
    profession: string;

    password: string;

    @Field(() => [Review], { nullable: true })
    async myReviews(
        @Ctx() { req, dataSources }: MyContext,
        @Arg('options', { nullable: true }) options: ReviewQueryOptions
    ): Promise<Review[] | undefined> {
        const uid = req.session.userId;
        if (uid === undefined) {
            return;
        }
        const res = options
            ? await dataSources.pgHandler.getReviewsGeneric(
                  options.partial_review
                      ? {
                            ...options.partial_review,
                            user_id: uid,
                        }
                      : { user_id: uid },
                  {
                      attribute: ReviewSortBy.LEASE_TERM,
                      sort: QueryOrderChoice.DESC,
                  }, // overwrite sort to most recent first
                  options.limit ? options.limit : undefined
              )
            : await dataSources.pgHandler.getReviewsGeneric({
                  user_id: uid,
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
