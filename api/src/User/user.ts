import { ObjectType, Field } from 'type-graphql';
import { User } from 'entities';

@ObjectType()
export class UserGQL implements User {
  @Field()
  user_id: number;

  @Field()
  first_name: string;

  @Field()
  last_name: string;

  @Field()
  email: string;

  password: string;

  @Field(() => String)
  created_at = new Date();

  @Field(() => String)
  updated_at = new Date();
}
