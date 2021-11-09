import { ObjectType, Field, Root } from 'type-graphql';
import Container from 'typedi';
import { postgresHandler } from '../dataSources/postgres';
import { Review } from '../Review/Review';
// import Container from 'typedi';
// import { postgresHandler } from '../dataSources/postgres';
// import { Review } from '../Review/Review';
import {
    FlagTypes,
    // QueryOrderChoice,
    // ReviewSortBy,
} from '../types/enum_types';
// import { GreenFlagTopics, RedFlagTopics } from '../types/object_types';

// import { createUnionType } from 'type-graphql';

// export const FlagTopics = createUnionType({
//     name: 'SearchResult',
//     types: () => [GreenFlagTopics, RedFlagTopics] as const,
// });

@ObjectType()
export class Flag {
    rev_id: number;

    @Field()
    flag_id: number;

    @Field(() => FlagTypes)
    category: FlagTypes;

    @Field() // incomplete typing
    topic: string;

    @Field()
    intensity: number;

    // Field Resolvers
    // Review
    @Field(() => [Review], { nullable: true })
    async review(@Root() flag: Flag): Promise<Review | undefined> {
        const pg = Container.get(postgresHandler);
        const reviews = await pg.getReviewsByReviewId([flag.rev_id]);
        if (reviews.errors || !reviews.reviews) return;
        return reviews.reviews[0];
    }

    @Field(() => String)
    created_at = new Date();

    @Field(() => String)
    updated_at = new Date();
}
