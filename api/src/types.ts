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
export class ReviewQueryInput {
  @Field(() => [Int], { nullable: true })
  reviews?: [number];
}

@InputType()
export class CreateResidencyInput {
  @Field()
  address: string;
}
@ObjectType()
export class ResidencyResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => ResidenceGQL, { nullable: true })
  residency?: ResidenceGQL;
}

@InputType()
export class WriteReviewInput {
  @Field()
  res_id: number;

  @Field()
  rating: number;

  @Field()
  rent: number;
}

@ObjectType()
export class ReviewResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => ReviewGQL, { nullable: true })
  review?: ReviewGQL;
}

// @ObjectType()
// export class Coords {
//   @Field()
//   lat: number;
//   @Field()
//   lng: number;
// }
