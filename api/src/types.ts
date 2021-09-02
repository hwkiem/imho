import { Request, Response } from 'express';
import { ObjectType, Field, InputType, Int, Float } from 'type-graphql';
import { googleMapsHandler } from './DataSources/mapsAPI';
import { postgresHandler } from './dataSources/postgres';
import { Residence } from './Residence/residence';
import { Review } from './Review/reviews';
import { User } from './User/user';

export type MyContext = {
    req: Request;
    res: Response;
    dataSources: {
        pgHandler: postgresHandler;
        googleMapsHandler: googleMapsHandler;
    };
};

@ObjectType()
export class Coords {
    @Field()
    lat: number;
    @Field()
    lng: number;
}

// @GRAPHQL
// @INPUT
@InputType() // subset of User used as filter values
export class PartialUser implements Partial<User> {
    @Field({ nullable: true })
    first_name?: string;
    @Field({ nullable: true })
    last_name?: string;
}

@InputType()
export class PartialReview implements Partial<Review> {
    @Field({ nullable: true })
    rating: number;

    @Field({ nullable: true })
    rent: number;
}

@InputType()
export class PartialResidence implements Partial<Residence> {
    @Field({ nullable: true })
    res_id: number;
    @Field({ nullable: true })
    google_place_id: string;
    @Field({ nullable: true })
    apt_num: string;
    @Field({ nullable: true })
    city: string;
    @Field({ nullable: true })
    postal_code: string;
    @Field({ nullable: true })
    route: string;
    @Field({ nullable: true })
    state: string;
    @Field({ nullable: true })
    avg_rent: number;
    @Field(() => Float, { nullable: true })
    avg_rating: number;
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
export class GeoBoundaryInput {
    @Field()
    xMax: number;
    @Field()
    xMin: number;
    @Field()
    yMax: number;
    @Field()
    yMin: number;
}

@InputType()
export class ChangePasswordInput {
    @Field()
    email: string;
    @Field()
    old_password: string;
    @Field()
    new_password: string;
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

@InputType()
export class WriteReviewInput {
    // input from frontend
    @Field()
    google_place_id: string;

    @Field(() => Float, { nullable: true })
    rating?: number;

    @Field({ nullable: true })
    rent?: number;

    user_id: number;
}

export class WriteReviewArgs {
    // args for backend
    res_id: number;
    user_id: number;
    rent?: number;
    rating?: number;
}

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

    @Field(() => [User], { nullable: true })
    users?: User[];
}

@ObjectType()
export class ResidenceResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => [Residence], { nullable: true })
    residences?: Residence[];
}

@ObjectType()
export class ReviewResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => [Review], { nullable: true })
    reviews?: Review[];
}

@ObjectType()
export class PlaceIDResponse {
    @Field(() => FieldError, { nullable: true })
    errors?: FieldError;

    @Field({ nullable: true })
    place_id?: string;
}
