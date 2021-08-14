import { ObjectType, Field } from "type-graphql";
import { User } from "entities";

@ObjectType()
export class UserGQL implements User {
  @Field()
  userId!: number;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  email!: string;

  password!: string;

  // housingHistory: [TenantReport]

  @Field(() => String)
  createdAt = new Date();

  @Field(() => String)
  updatedAt = new Date();
}
