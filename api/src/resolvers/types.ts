import { ObjectType, Field, InputType, Int } from 'type-graphql';
import { Residence } from '../entities/Residence';
import { Review } from '../entities/Reviews';
import { User } from '../entities/User';

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

  @Field(() => User, { nullable: true })
  user?: User;
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

  @Field(() => Residence, { nullable: true })
  residency?: Residence;
}

@InputType()
export class WriteReviewInput {
  @Field()
  address!: string;

  @Field()
  apptNo: string;

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

@ObjectType()
export class Coords {
  @Field()
  lat: number;
  @Field()
  lng: number;
}
