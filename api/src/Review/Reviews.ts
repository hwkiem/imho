import { ObjectType, Field, Int, Float } from 'type-graphql';

@ObjectType()
export class Review {
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
