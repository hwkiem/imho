import { Field, Float, InputType, Int } from 'type-graphql';
import { Residence } from '../Residence/Residence';
import { Review } from '../Review/Review';
import { User } from '../User/User';
import { Location } from '../Location/Location';
import {
    FlagTypes,
    GreenFlags,
    LocationCategory,
    LocationSortBy,
    QueryOrderChoice,
    RedFlags,
    ResidenceSortBy,
    ReviewSortBy,
    UserSortBy,
} from './enum_types';
import { ReviewFields } from './types';

@InputType()
export class AllFlagTopicsInput {
    @Field(() => GreenFlags, { nullable: true })
    green_flags?: GreenFlags;
    @Field(() => RedFlags, { nullable: true })
    red_flags?: RedFlags;
}
@InputType()
export class FlagInput {
    @Field(() => FlagTypes)
    category: FlagTypes;
    @Field(() => RedFlags, { nullable: true })
    red_topic?: RedFlags;
    @Field(() => GreenFlags, { nullable: true })
    green_topic?: GreenFlags;
    // @Field()
    // rev_id: number;
}

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

    @Field(() => DateRangeInput, { nullable: true })
    lease_term?: DateRangeInput;
}

@InputType()
export class PartialResidence implements Partial<Residence> {
    @Field({ nullable: true })
    res_id?: number;
    @Field({ nullable: true })
    google_place_id?: string;
    @Field({ nullable: true })
    avg_rent?: number;
    @Field(() => Float, { nullable: true })
    avg_rating?: number;
    @Field({ nullable: true })
    unit?: string;
}

@InputType()
export class PartialLocation implements Partial<Location> {
    @Field({ nullable: true })
    loc_id?: number;
    @Field({ nullable: true })
    google_place_id?: string;
    @Field({ nullable: true })
    street_num?: string;
    @Field({ nullable: true })
    route?: string;
    @Field({ nullable: true })
    city?: string;
    @Field({ nullable: true })
    postal_code?: string;
    @Field({ nullable: true })
    state?: string;
    // averages on locations? fewer than on residences?
    // @Field({ nullable: true })
    // avg_rent?: number;
    // @Field(() => Float, { nullable: true })
    // avg_rating?: number;
}

@InputType()
export class ResidenceSortByInput {
    @Field(() => ResidenceSortBy)
    attribute: ResidenceSortBy;
    @Field(() => QueryOrderChoice)
    sort: QueryOrderChoice;
}

@InputType()
export class LocationSortByInput {
    @Field(() => LocationSortBy)
    attribute: LocationSortBy;
    @Field(() => QueryOrderChoice)
    sort: QueryOrderChoice;
}

@InputType()
export class ReviewSortByInput {
    @Field(() => ReviewSortBy)
    attribute: ReviewSortBy;
    @Field(() => QueryOrderChoice)
    sort: QueryOrderChoice;
}

@InputType()
export class UserSortByInput {
    @Field(() => UserSortBy)
    attribute: UserSortBy;
    @Field(() => QueryOrderChoice)
    sort: QueryOrderChoice;
}

@InputType()
export class ResidenceQueryOptions {
    @Field(() => Int, { nullable: true })
    limit?: number;
    @Field(() => ResidenceSortByInput, { nullable: true })
    sort_params?: ResidenceSortByInput;
    @Field(() => PartialResidence, { nullable: true })
    partial_residence?: PartialResidence;

    loc_id: number; // field resolver
}

@InputType()
export class LocationQueryOptions {
    @Field(() => Int, { nullable: true })
    limit?: number;
    @Field(() => LocationSortByInput, { nullable: true })
    sort_params?: LocationSortByInput;
    @Field(() => PartialLocation, { nullable: true })
    partial_location?: PartialLocation;
}

@InputType()
export class ReviewQueryOptions {
    @Field(() => Int, { nullable: true })
    limit?: number;
    @Field(() => ReviewSortByInput, { nullable: true })
    sort_params?: ReviewSortByInput;
    @Field(() => PartialReview, { nullable: true })
    partial_review?: PartialReview;
}

@InputType()
export class UserQueryOptions {
    @Field(() => Int, { nullable: true })
    limit?: number;
    @Field(() => UserSortByInput, { nullable: true })
    sort_params?: UserSortByInput;
    @Field(() => PartialUser, { nullable: true })
    partial_user?: PartialUser;
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

    @Field()
    unit: string;
}

@InputType()
export class ReviewFieldsInput implements ReviewFields {
    @Field()
    rating: number;

    @Field()
    rent?: number;

    @Field(() => DateRangeInput)
    lease_term: DateRangeInput;

    @Field()
    feedback?: string;
}

@InputType()
export class WriteReviewInput {
    @Field()
    google_place_id: string;

    @Field()
    unit: string;

    @Field(() => ReviewFieldsInput)
    review_input: ReviewFieldsInput;

    @Field(() => LocationCategory)
    category: LocationCategory;

    @Field()
    landlord_email: string;
}

@InputType()
export class LocationInput {
    @Field(() => LocationCategory)
    category: LocationCategory;
    @Field()
    landlord_email: string;
}
