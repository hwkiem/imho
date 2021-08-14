import { ObjectType, Field, Int, Float } from "type-graphql";
import { Review } from "entities";

@ObjectType()
export class ReviewGQL implements Review {
  @Field(() => Int)
  resId!: string;

  @Field()
  userId!: number;

  @Field(() => Float)
  rating!: number;

  @Field()
  rent!: number;

  @Field(() => String)
  createdAt = new Date();

  @Field(() => String)
  updatedAt = new Date();
}
