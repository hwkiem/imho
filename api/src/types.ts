import { Client } from "@googlemaps/google-maps-services-js";
import { Request, Response } from "express";
import { Pool } from "pg";
import { ObjectType, Field, InputType, Int } from "type-graphql";
import { ResidenceGQL } from "./Residence/residence";
import { Review } from "./Review/Reviews";
import { UserGQL } from "./User/user";

export type MyContext = {
  req: Request; //& { session: Express.Session };
  res: Response;
  pool: Pool;
  client: Client;
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

  @Field(() => UserGQL, { nullable: true })
  user?: UserGQL;
}

@InputType()
export class RegisterInput {
  @Field()
  email: string;
  @Field()
  firstName: string;
  @Field()
  lastName: string;
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

  @Field(() => Review, { nullable: true })
  review?: Review;
}

// @ObjectType()
// export class Coords {
//   @Field()
//   lat: number;
//   @Field()
//   lng: number;
// }
