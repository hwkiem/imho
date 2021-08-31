import { Client } from '@googlemaps/google-maps-services-js';
import { Request, Response } from 'express';
import { ObjectType, Field, InputType, Int } from 'type-graphql';
import { googleMapsHandler } from './DataSources/mapsAPI';
import { postgresHandler } from './dataSources/postgres';
import { Residence } from './Residence/residence';
import { Review } from './Review/reviews';
import { User } from './User/user';

export type MyContext = {
    req: Request; //& { session: Express.Session };
    res: Response;
    client: Client;
    dataSources: {
        pgHandler: postgresHandler;
        googleMapsHandler: googleMapsHandler;
    };
};

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

@InputType()
export class WriteReviewInput {
    // input from frontend
    @Field()
    google_place_id: string;

    @Field({ nullable: true })
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
export class Coords {
    @Field()
    lat: number;
    @Field()
    lng: number;
}

@ObjectType()
export class PlaceIDResponse {
    @Field(() => FieldError, { nullable: true })
    errors?: FieldError;

    @Field({ nullable: true })
    place_id?: string;
}
