import { Client } from '@googlemaps/google-maps-services-js';
import { Request, Response } from 'express';
import { Pool } from 'pg';
import { ObjectType, Field, InputType, Int } from 'type-graphql';
import { postgresHandler } from './dataSources/postgres';
import { ResidenceGQL } from './Residence/residence';
import { ReviewGQL } from './Review/Reviews';
import { UserGQL } from './User/user';

export type MyContext = {
  req: Request; //& { session: Express.Session };
  res: Response;
  pool: Pool;
  client: Client;
  dataSources: { pgHandler: postgresHandler };
};

@InputType() // subset of User used as filter values
export class PartialUser implements Partial<UserGQL> {
  @Field({ nullable: true })
  first_name?: string;
  @Field({ nullable: true })
  last_name?: string;
}

@InputType()
export class PartialReview implements Partial<ReviewGQL> {
  @Field({ nullable: true })
  rating: number;

  @Field({ nullable: true })
  rent: number;
}
@InputType()
export class PartialResidence implements Partial<ResidenceGQL> {
  @Field({ nullable: true })
  apt_num: string;
  @Field({ nullable: true })
  avg_rent: number;
  @Field({ nullable: true })
  city: string;
  @Field({ nullable: true })
  postal_code: string;
  @Field({ nullable: true })
  route: string;
  @Field({ nullable: true })
  state: string;
}

// use this for getReviewById?
// @InputType()
// export class PickReviewID implements Pick<ReviewGQL, 'res_id' | 'user_id'> {
//   @Field()
//   user_id: number;
//   @Field()
//   res_id: number;
// }

@ObjectType()
export class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => [UserGQL], { nullable: true })
  users?: UserGQL[];
}

@InputType()
export class RegisterInput {
  @Field()
  email: string;
  @Field()
  first_name: string;
  @Field()
  last_name: string;
  @Field()
  password: string;
}

@InputType()
export class LoginInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

@InputType()
export class ReviewQueryInput {
  @Field(() => [Int], { nullable: true })
  reviews?: [number];
}

@InputType()
export class CreateResidenceInput {
  @Field()
  google_place_id: string;
}
@ObjectType()
export class ResidenceResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => [ResidenceGQL], { nullable: true })
  residences?: [ResidenceGQL];
}

@InputType()
export class WriteReviewInput {
  @Field()
  res_id: number;

  @Field()
  rating: number;

  @Field()
  rent: number;

  user_id: number;
}

@ObjectType()
export class ReviewResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => [ReviewGQL], { nullable: true })
  reviews?: ReviewGQL[];
}

@ObjectType()
export class Coords {
  @Field()
  lat: number;
  @Field()
  lng: number;
}
