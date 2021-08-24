import { ObjectType, Field, Int, Float } from 'type-graphql'
import { Review } from 'entities'

@ObjectType()
export class ReviewGQL implements Review {
    @Field(() => Int)
    res_id: number

    @Field()
    user_id: number

    @Field(() => Float)
    rating: number

    @Field()
    rent: number

    @Field(() => String)
    created_at = new Date()

    @Field(() => String)
    updated_at = new Date()
}
