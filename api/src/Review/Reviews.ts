import { ObjectType, Field, Float } from 'type-graphql';

@ObjectType()
export class Review {
    @Field()
    res_id: number;

    @Field()
    user_id: number;

    @Field(() => Float, { nullable: true })
    rating?: number;

    @Field({ nullable: true })
    rent?: number;

    @Field(() => String)
    created_at = new Date();

    @Field(() => String)
    updated_at = new Date();
}
