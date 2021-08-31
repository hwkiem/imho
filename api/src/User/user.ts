import { ObjectType, Field, Arg, Ctx } from 'type-graphql';
import { Review } from '../Review/reviews';
import { MyContext } from '../types';

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
        @Arg('id') id: number,
        @Ctx() { dataSources }: MyContext
    ): Promise<Review[] | undefined> {
        // validate their context matches their request?
        const res = await dataSources.pgHandler.getReviewsByUserId([id]);
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
