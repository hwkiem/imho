import { ObjectType, Field, Ctx, Arg, Root } from 'type-graphql';
import Container from 'typedi';
import { postgresHandler } from '../dataSources/postgres';
import { Residence } from '../Residence/Residence';
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
    profession?: string;

    password: string;

    @Field(() => [Review], { nullable: true })
    async myReviews(
        @Ctx() { req }: MyContext,
        @Arg('options', { nullable: true }) options: ReviewQueryOptions
    ): Promise<Review[] | undefined> {
        const uid = req.session.userId;
        if (uid === undefined) {
            return;
        }
        const pg = Container.get(postgresHandler);
        const res = options
            ? await pg.getReviewsGeneric(
                  options.partial_review
                      ? {
                            ...options.partial_review,
                            user_id: uid,
                        }
                      : { user_id: uid },
                  {
                      attribute: ReviewSortBy.USER_ID,
                      sort: QueryOrderChoice.DESC,
                  }, // shouldnt do anything
                  options.limit ? options.limit : undefined
              )
            : await pg.getReviewsGeneric({
                  user_id: uid,
              });

        if (!res.errors && res.reviews) {
            return res.reviews;
        }
        return;
    }

    @Field(() => [Residence], { nullable: true })
    async savedResidences(
        @Root() user: User
    ): Promise<Residence[] | undefined> {
        const uid = user.user_id;
        if (uid === undefined) {
            return;
        }
        const pg = Container.get(postgresHandler);
        const res = await pg.getSavedResidences(user.user_id);
        if (!res.errors && res.residences) {
            return res.residences;
        }
        return;
    }

    @Field(() => String)
    created_at = new Date();

    @Field(() => String)
    updated_at = new Date();
}
