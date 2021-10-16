import { Field, ObjectType } from 'type-graphql';
import { Residence } from '../Residence/Residence';
import { Review } from '../Review/Review';
import { User } from '../User/User';
import { Location } from '../Location/Location';

@ObjectType()
export class Coords {
    @Field()
    lat: number;
    @Field()
    lng: number;
}

@ObjectType()
export class DateRange {
    @Field(() => Date)
    start_date: Date;
    @Field(() => Date)
    end_date: Date;
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
export class SingleUserResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => User, { nullable: true })
    user?: User;
}

@ObjectType()
export class ResidenceResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => [Residence], { nullable: true })
    residences?: Residence[];
}
@ObjectType()
export class LocationResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => [Location], { nullable: true })
    locations?: Location[];
}

@ObjectType()
export class SingleResidenceResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => Residence, { nullable: true })
    residence?: Residence;
}
@ObjectType()
export class SingleLocationResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => Location, { nullable: true })
    location?: Location;
}

@ObjectType()
export class ReviewResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => [Review], { nullable: true })
    reviews?: Review[];
}

@ObjectType()
export class SingleReviewResponse {
    @Field(() => [FieldError], { nullable: true })
    errors?: FieldError[];

    @Field(() => Review, { nullable: true })
    review?: Review;
}

@ObjectType()
export class PlaceIDResponse {
    @Field(() => FieldError, { nullable: true })
    errors?: FieldError;

    @Field({ nullable: true })
    place_id?: string;
}
