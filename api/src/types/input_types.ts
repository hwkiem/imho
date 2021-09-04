import { Field, Float, InputType, Int } from 'type-graphql';
import { Residence } from '../Residence/residence';
import { Review } from '../Review/reviews';
import { User } from '../User/user';
import { StoveType } from './enum_types';

@InputType() // subset of User used as filter values
export class PartialUser implements Partial<User> {
    @Field({ nullable: true })
    first_name?: string;
    @Field({ nullable: true })
    last_name?: string;
}

@InputType()
export class DateRangeInput {
    @Field(() => Date)
    start_date: Date;
    @Field(() => Date)
    end_date: Date;
}

@InputType()
export class PartialReview implements Partial<Review> {
    @Field({ nullable: true })
    rating: number;

    @Field({ nullable: true })
    rent: number;

    @Field({ nullable: true })
    air_conditioning?: boolean;

    @Field({ nullable: true })
    heat?: boolean;

    @Field(() => StoveType, { nullable: true })
    stove?: StoveType;

    @Field({ nullable: true })
    pool?: boolean;

    @Field({ nullable: true })
    gym?: boolean;

    @Field({ nullable: true })
    garbage_disposal?: boolean;

    @Field({ nullable: true })
    dishwasher?: boolean;

    @Field({ nullable: true })
    parking?: boolean;

    @Field({ nullable: true })
    doorman?: boolean;

    @Field(() => DateRangeInput, { nullable: true })
    lease_term?: DateRangeInput;
}

@InputType()
export class ResidenceSortByInput {
    @Field()
    attribute: string;
    @Field()
    sort: string;
}

// @InputType()
// export class ResidenceSortByInput {
//     @Field()
//     attribute: string;
//     @Field()
//     sort: string;
// }

@InputType()
export class PartialResidence implements Partial<Residence> {
    @Field({ nullable: true })
    res_id: number;
    @Field({ nullable: true })
    google_place_id: string;
    @Field({ nullable: true })
    apt_num: string;
    @Field({ nullable: true })
    street_num: string;
    @Field({ nullable: true })
    route: string;
    @Field({ nullable: true })
    city: string;
    @Field({ nullable: true })
    postal_code: string;
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

    @Field({ nullable: true })
    air_conditioning?: boolean;

    @Field({ nullable: true })
    heat?: boolean;

    @Field(() => StoveType, { nullable: true })
    stove?: StoveType;

    @Field({ nullable: true })
    pool?: boolean;

    @Field({ nullable: true })
    gym?: boolean;

    @Field({ nullable: true })
    garbage_disposal?: boolean;

    @Field({ nullable: true })
    dishwasher?: boolean;

    @Field({ nullable: true })
    parking?: boolean;

    @Field({ nullable: true })
    doorman?: boolean;

    @Field(() => DateRangeInput, { nullable: true })
    lease_term?: DateRangeInput;

    // for db
    lease_term_?: Range;

    user_id?: number;

    res_id?: number;
}
