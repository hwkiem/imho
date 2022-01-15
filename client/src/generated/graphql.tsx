import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type ChangePasswordInput = {
  email: Scalars['String'];
  new_password: Scalars['String'];
  old_password: Scalars['String'];
};

export type Coords = {
  __typename?: 'Coords';
  lat: Scalars['Float'];
  lng: Scalars['Float'];
};

export type CreateResidenceInput = {
  google_place_id: Scalars['String'];
  unit: Scalars['String'];
};

export type DateRange = {
  __typename?: 'DateRange';
  end_date: Scalars['DateTime'];
  start_date: Scalars['DateTime'];
};

export type DateRangeInput = {
  end_date: Scalars['DateTime'];
  start_date: Scalars['DateTime'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Flag = {
  __typename?: 'Flag';
  category: FlagTypes;
  created_at: Scalars['String'];
  flag_id: Scalars['Float'];
  review?: Maybe<Array<Review>>;
  topic: Scalars['String'];
  updated_at: Scalars['String'];
};

export type FlagInput = {
  category: FlagTypes;
  green_topic?: Maybe<GreenFlags>;
  red_topic?: Maybe<RedFlags>;
};

export type FlagResponse = {
  __typename?: 'FlagResponse';
  errors?: Maybe<Array<FieldError>>;
  flags?: Maybe<Array<Flag>>;
};

/** Types of flags assigned to an apartment */
export enum FlagTypes {
  Green = 'GREEN',
  Red = 'RED'
}

export type GeoBoundaryInput = {
  xMax: Scalars['Float'];
  xMin: Scalars['Float'];
  yMax: Scalars['Float'];
  yMin: Scalars['Float'];
};

/** Things someone liked about their place */
export enum GreenFlags {
  Appliances = 'APPLIANCES',
  Light = 'LIGHT',
  Neighborhood = 'NEIGHBORHOOD',
  Privacy = 'PRIVACY',
  Reponsiveness = 'REPONSIVENESS',
  Safe = 'SAFE',
  TempControl = 'TEMP_CONTROL',
  WaterPressure = 'WATER_PRESSURE'
}

export type Location = {
  __typename?: 'Location';
  avg_rating?: Maybe<Scalars['Float']>;
  avg_rent?: Maybe<Scalars['Float']>;
  category: LocationCategory;
  coords: Coords;
  formatted_address: Scalars['String'];
  google_place_id: Scalars['String'];
  imho_score?: Maybe<Scalars['Float']>;
  landlord_email?: Maybe<Scalars['String']>;
  loc_id: Scalars['Float'];
  residences?: Maybe<Array<Residence>>;
};


export type LocationResidencesArgs = {
  options?: Maybe<ResidenceQueryOptions>;
};

/** Two categories of location - single or multi residence */
export enum LocationCategory {
  ApartmentBuilding = 'APARTMENT_BUILDING',
  House = 'HOUSE'
}

export type LocationQueryOptions = {
  limit?: Maybe<Scalars['Int']>;
  partial_location?: Maybe<PartialLocation>;
  sort_params?: Maybe<LocationSortByInput>;
};

export type LocationResponse = {
  __typename?: 'LocationResponse';
  errors?: Maybe<Array<FieldError>>;
  locations?: Maybe<Array<Location>>;
};

/** Field by which to sort location query results */
export enum LocationSortBy {
  Id = 'ID',
  Rating = 'RATING',
  Rent = 'RENT'
}

export type LocationSortByInput = {
  attribute: LocationSortBy;
  sort: QueryOrderChoice;
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changeMyPassword: UserResponse;
  createFlag: FlagResponse;
  createLocation: SingleLocationResponse;
  createResidence: SingleResidenceResponse;
  deleteUser: SingleUserResponse;
  login: SingleUserResponse;
  logout: SingleUserResponse;
  register: SingleUserResponse;
  saveResidence: SingleResidenceResponse;
  writeReview: SingleReviewResponse;
};


export type MutationChangeMyPasswordArgs = {
  args: ChangePasswordInput;
};


export type MutationCreateFlagArgs = {
  options: FlagInput;
  rev_id: Scalars['Int'];
};


export type MutationCreateLocationArgs = {
  category: LocationCategory;
  landlord_email: Scalars['String'];
  place_id: Scalars['String'];
};


export type MutationCreateResidenceArgs = {
  options: CreateResidenceInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['Float'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterArgs = {
  options: RegisterInput;
};


export type MutationSaveResidenceArgs = {
  res_id: Scalars['Float'];
};


export type MutationWriteReviewArgs = {
  flags: Array<FlagInput>;
  options: WriteReviewInput;
};

export type PartialLocation = {
  city?: Maybe<Scalars['String']>;
  google_place_id?: Maybe<Scalars['String']>;
  loc_id?: Maybe<Scalars['Float']>;
  postal_code?: Maybe<Scalars['String']>;
  route?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  street_num?: Maybe<Scalars['String']>;
};

export type PartialResidence = {
  avg_rating?: Maybe<Scalars['Float']>;
  avg_rent?: Maybe<Scalars['Float']>;
  google_place_id?: Maybe<Scalars['String']>;
  res_id?: Maybe<Scalars['Float']>;
  unit?: Maybe<Scalars['String']>;
};

export type PartialReview = {
  lease_term?: Maybe<DateRangeInput>;
  rating?: Maybe<Scalars['Float']>;
  rent?: Maybe<Scalars['Float']>;
};

export type PartialUser = {
  first_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
};

export type PlaceIdResponse = {
  __typename?: 'PlaceIDResponse';
  errors?: Maybe<FieldError>;
  place_id?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getFlagsById: FlagResponse;
  getLocationByPlaceId: SingleLocationResponse;
  getLocationsBoundingBox: LocationResponse;
  getLocationsByGeoScope: LocationResponse;
  getLocationsById: LocationResponse;
  getLocationsGeneric: LocationResponse;
  getResidencesById: ResidenceResponse;
  getResidencesGeneric: ResidenceResponse;
  getReviewsByResidenceId: ReviewResponse;
  getReviewsByUserId: ReviewResponse;
  getReviewsGeneric: ReviewResponse;
  getUsersGeneric: UserResponse;
  getUsersbyId: UserResponse;
  me: SingleUserResponse;
  placeIdFromAddress: PlaceIdResponse;
};


export type QueryGetFlagsByIdArgs = {
  flag_ids: Array<Scalars['Int']>;
};


export type QueryGetLocationByPlaceIdArgs = {
  google_place_id: Scalars['String'];
};


export type QueryGetLocationsBoundingBoxArgs = {
  options?: Maybe<LocationQueryOptions>;
  perimeter: GeoBoundaryInput;
};


export type QueryGetLocationsByGeoScopeArgs = {
  options?: Maybe<LocationQueryOptions>;
  place_id: Scalars['String'];
};


export type QueryGetLocationsByIdArgs = {
  loc_ids: Array<Scalars['Int']>;
};


export type QueryGetLocationsGenericArgs = {
  options?: Maybe<LocationQueryOptions>;
};


export type QueryGetResidencesByIdArgs = {
  res_ids: Array<Scalars['Int']>;
};


export type QueryGetResidencesGenericArgs = {
  options?: Maybe<ResidenceQueryOptions>;
};


export type QueryGetReviewsByResidenceIdArgs = {
  residence_ids: Array<Scalars['Int']>;
};


export type QueryGetReviewsByUserIdArgs = {
  user_ids: Array<Scalars['Int']>;
};


export type QueryGetReviewsGenericArgs = {
  options?: Maybe<ReviewQueryOptions>;
};


export type QueryGetUsersGenericArgs = {
  options?: Maybe<UserQueryOptions>;
};


export type QueryGetUsersbyIdArgs = {
  user_ids: Array<Scalars['Int']>;
};


export type QueryPlaceIdFromAddressArgs = {
  address: Scalars['String'];
};

/** OrderBy options */
export enum QueryOrderChoice {
  Asc = 'ASC',
  Desc = 'DESC'
}

/** Things someone disliked about their place */
export enum RedFlags {
  Mold = 'MOLD',
  Noise = 'NOISE',
  Pests = 'PESTS',
  Privacy = 'PRIVACY',
  SafetyDeposit = 'SAFETY_DEPOSIT',
  Smell = 'SMELL',
  TempControl = 'TEMP_CONTROL',
  Unresponsive = 'UNRESPONSIVE',
  WaterPressure = 'WATER_PRESSURE'
}

export type RegisterInput = {
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  password: Scalars['String'];
};

export type Residence = {
  __typename?: 'Residence';
  avg_rating?: Maybe<Scalars['Float']>;
  avg_rent?: Maybe<Scalars['Float']>;
  created_at: Scalars['String'];
  loc_id: Scalars['Float'];
  res_id: Scalars['Float'];
  reviews?: Maybe<ReviewsAndCount>;
  unit: Scalars['String'];
  updated_at: Scalars['String'];
};


export type ResidenceReviewsArgs = {
  options?: Maybe<ReviewQueryOptions>;
};

export type ResidenceQueryOptions = {
  limit?: Maybe<Scalars['Int']>;
  partial_residence?: Maybe<PartialResidence>;
  sort_params?: Maybe<ResidenceSortByInput>;
};

export type ResidenceResponse = {
  __typename?: 'ResidenceResponse';
  errors?: Maybe<Array<FieldError>>;
  residences?: Maybe<Array<Residence>>;
};

/** Field by which to sort residence query results */
export enum ResidenceSortBy {
  Id = 'ID',
  Rating = 'RATING',
  Rent = 'RENT'
}

export type ResidenceSortByInput = {
  attribute: ResidenceSortBy;
  sort: QueryOrderChoice;
};

export type Review = {
  __typename?: 'Review';
  created_at: Scalars['String'];
  feedback?: Maybe<Scalars['String']>;
  flags?: Maybe<Array<Flag>>;
  lease_term: DateRange;
  rating: Scalars['Float'];
  rent?: Maybe<Scalars['Float']>;
  residence?: Maybe<Residence>;
  rev_id: Scalars['Float'];
  updated_at: Scalars['String'];
  user?: Maybe<User>;
};

export type ReviewFieldsInput = {
  feedback: Scalars['String'];
  lease_term: DateRangeInput;
  rating: Scalars['Float'];
  rent: Scalars['Float'];
};

export type ReviewQueryOptions = {
  limit?: Maybe<Scalars['Int']>;
  partial_review?: Maybe<PartialReview>;
  sort_params?: Maybe<ReviewSortByInput>;
};

export type ReviewResponse = {
  __typename?: 'ReviewResponse';
  errors?: Maybe<Array<FieldError>>;
  reviews?: Maybe<Array<Review>>;
};

/** Field by which to sort review query results */
export enum ReviewSortBy {
  LeaseTerm = 'LEASE_TERM',
  Rating = 'RATING',
  Rent = 'RENT',
  UserId = 'USER_ID'
}

export type ReviewSortByInput = {
  attribute: ReviewSortBy;
  sort: QueryOrderChoice;
};

export type ReviewsAndCount = {
  __typename?: 'ReviewsAndCount';
  count: Scalars['Int'];
  reviews?: Maybe<Array<Review>>;
};

export type SingleLocationResponse = {
  __typename?: 'SingleLocationResponse';
  errors?: Maybe<Array<FieldError>>;
  location?: Maybe<Location>;
};

export type SingleResidenceResponse = {
  __typename?: 'SingleResidenceResponse';
  errors?: Maybe<Array<FieldError>>;
  residence?: Maybe<Residence>;
};

export type SingleReviewResponse = {
  __typename?: 'SingleReviewResponse';
  errors?: Maybe<Array<FieldError>>;
  review?: Maybe<Review>;
};

export type SingleUserResponse = {
  __typename?: 'SingleUserResponse';
  errors?: Maybe<Array<FieldError>>;
  user?: Maybe<User>;
};

export type User = {
  __typename?: 'User';
  created_at: Scalars['String'];
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  myReviews?: Maybe<Array<Review>>;
  profession?: Maybe<Scalars['String']>;
  savedResidences?: Maybe<Array<Residence>>;
  updated_at: Scalars['String'];
  user_id: Scalars['Float'];
};


export type UserMyReviewsArgs = {
  options?: Maybe<ReviewQueryOptions>;
};

export type UserQueryOptions = {
  limit?: Maybe<Scalars['Int']>;
  partial_user?: Maybe<PartialUser>;
  sort_params?: Maybe<UserSortByInput>;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  users?: Maybe<Array<User>>;
};

/** Field by which to sort user query results */
export enum UserSortBy {
  Id = 'ID'
}

export type UserSortByInput = {
  attribute: UserSortBy;
  sort: QueryOrderChoice;
};

export type WriteReviewInput = {
  category: LocationCategory;
  google_place_id: Scalars['String'];
  landlord_email: Scalars['String'];
  review_input: ReviewFieldsInput;
  unit: Scalars['String'];
};

export type RegularErrorFragment = { __typename?: 'FieldError', field: string, message: string };

export type RegularLocationFragment = { __typename?: 'Location', loc_id: number, imho_score?: number | null | undefined, landlord_email?: string | null | undefined, category: LocationCategory, google_place_id: string, formatted_address: string, avg_rent?: number | null | undefined, avg_rating?: number | null | undefined, coords: { __typename?: 'Coords', lat: number, lng: number }, residences?: Array<{ __typename?: 'Residence', res_id: number, loc_id: number, unit: string, avg_rating?: number | null | undefined, avg_rent?: number | null | undefined, reviews?: { __typename?: 'ReviewsAndCount', count: number, reviews?: Array<{ __typename?: 'Review', rev_id: number, rating: number, rent?: number | null | undefined, feedback?: string | null | undefined, created_at: string, updated_at: string, user?: { __typename?: 'User', email: string } | null | undefined, flags?: Array<{ __typename?: 'Flag', category: FlagTypes, topic: string }> | null | undefined, lease_term: { __typename?: 'DateRange', start_date: any, end_date: any } }> | null | undefined } | null | undefined }> | null | undefined };

export type RegularLocationResponseFragment = { __typename?: 'SingleLocationResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, location?: { __typename?: 'Location', loc_id: number, imho_score?: number | null | undefined, landlord_email?: string | null | undefined, category: LocationCategory, google_place_id: string, formatted_address: string, avg_rent?: number | null | undefined, avg_rating?: number | null | undefined, coords: { __typename?: 'Coords', lat: number, lng: number }, residences?: Array<{ __typename?: 'Residence', res_id: number, loc_id: number, unit: string, avg_rating?: number | null | undefined, avg_rent?: number | null | undefined, reviews?: { __typename?: 'ReviewsAndCount', count: number, reviews?: Array<{ __typename?: 'Review', rev_id: number, rating: number, rent?: number | null | undefined, feedback?: string | null | undefined, created_at: string, updated_at: string, user?: { __typename?: 'User', email: string } | null | undefined, flags?: Array<{ __typename?: 'Flag', category: FlagTypes, topic: string }> | null | undefined, lease_term: { __typename?: 'DateRange', start_date: any, end_date: any } }> | null | undefined } | null | undefined }> | null | undefined } | null | undefined };

export type RegularResidenceFragment = { __typename?: 'Residence', res_id: number, loc_id: number, unit: string, avg_rating?: number | null | undefined, avg_rent?: number | null | undefined, reviews?: { __typename?: 'ReviewsAndCount', count: number, reviews?: Array<{ __typename?: 'Review', rev_id: number, rating: number, rent?: number | null | undefined, feedback?: string | null | undefined, created_at: string, updated_at: string, user?: { __typename?: 'User', email: string } | null | undefined, flags?: Array<{ __typename?: 'Flag', category: FlagTypes, topic: string }> | null | undefined, lease_term: { __typename?: 'DateRange', start_date: any, end_date: any } }> | null | undefined } | null | undefined };

export type RegularReviewFragment = { __typename?: 'Review', rev_id: number, rating: number, rent?: number | null | undefined, feedback?: string | null | undefined, created_at: string, updated_at: string, user?: { __typename?: 'User', email: string } | null | undefined, flags?: Array<{ __typename?: 'Flag', category: FlagTypes, topic: string }> | null | undefined, lease_term: { __typename?: 'DateRange', start_date: any, end_date: any } };

export type RegularUserFragment = { __typename?: 'User', user_id: number, first_name: string, last_name: string, email: string, created_at: string, updated_at: string };

export type RegularUserResponseFragment = { __typename?: 'SingleUserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', user_id: number, first_name: string, last_name: string, email: string, created_at: string, updated_at: string } | null | undefined };

export type RegularSingleReviewResponseFragment = { __typename?: 'SingleReviewResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, review?: { __typename?: 'Review', rev_id: number, rating: number, rent?: number | null | undefined, feedback?: string | null | undefined, created_at: string, updated_at: string, user?: { __typename?: 'User', email: string } | null | undefined, flags?: Array<{ __typename?: 'Flag', category: FlagTypes, topic: string }> | null | undefined, lease_term: { __typename?: 'DateRange', start_date: any, end_date: any } } | null | undefined };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'SingleUserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', user_id: number, first_name: string, last_name: string, email: string, created_at: string, updated_at: string } | null | undefined } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'SingleUserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', user_id: number, first_name: string, last_name: string, email: string, created_at: string, updated_at: string } | null | undefined } };

export type RegisterMutationVariables = Exact<{
  options: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'SingleUserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', user_id: number, first_name: string, last_name: string, email: string, created_at: string, updated_at: string } | null | undefined } };

export type WriteReviewMutationVariables = Exact<{
  flags: Array<FlagInput> | FlagInput;
  options: WriteReviewInput;
}>;


export type WriteReviewMutation = { __typename?: 'Mutation', writeReview: { __typename?: 'SingleReviewResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, review?: { __typename?: 'Review', rev_id: number, rating: number, rent?: number | null | undefined, feedback?: string | null | undefined, created_at: string, updated_at: string, user?: { __typename?: 'User', email: string } | null | undefined, flags?: Array<{ __typename?: 'Flag', category: FlagTypes, topic: string }> | null | undefined, lease_term: { __typename?: 'DateRange', start_date: any, end_date: any } } | null | undefined } };

export type GetLocationsByPlaceIdQueryVariables = Exact<{
  google_place_id: Scalars['String'];
}>;


export type GetLocationsByPlaceIdQuery = { __typename?: 'Query', getLocationByPlaceId: { __typename?: 'SingleLocationResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, location?: { __typename?: 'Location', loc_id: number, imho_score?: number | null | undefined, landlord_email?: string | null | undefined, category: LocationCategory, google_place_id: string, formatted_address: string, avg_rent?: number | null | undefined, avg_rating?: number | null | undefined, coords: { __typename?: 'Coords', lat: number, lng: number }, residences?: Array<{ __typename?: 'Residence', res_id: number, loc_id: number, unit: string, avg_rating?: number | null | undefined, avg_rent?: number | null | undefined, reviews?: { __typename?: 'ReviewsAndCount', count: number, reviews?: Array<{ __typename?: 'Review', rev_id: number, rating: number, rent?: number | null | undefined, feedback?: string | null | undefined, created_at: string, updated_at: string, user?: { __typename?: 'User', email: string } | null | undefined, flags?: Array<{ __typename?: 'Flag', category: FlagTypes, topic: string }> | null | undefined, lease_term: { __typename?: 'DateRange', start_date: any, end_date: any } }> | null | undefined } | null | undefined }> | null | undefined } | null | undefined } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'SingleUserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', user_id: number, first_name: string, last_name: string, email: string, created_at: string, updated_at: string } | null | undefined } };

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularReviewFragmentDoc = gql`
    fragment RegularReview on Review {
  rev_id
  user {
    email
  }
  flags {
    category
    topic
  }
  rating
  rent
  lease_term {
    start_date
    end_date
  }
  feedback
  created_at
  updated_at
}
    `;
export const RegularLocationFragmentDoc = gql`
    fragment RegularLocation on Location {
  loc_id
  imho_score
  landlord_email
  category
  google_place_id
  formatted_address
  coords {
    lat
    lng
  }
  avg_rent
  avg_rating
  residences {
    res_id
    loc_id
    unit
    avg_rating
    avg_rent
    reviews {
      reviews {
        ...RegularReview
      }
      count
    }
  }
}
    ${RegularReviewFragmentDoc}`;
export const RegularLocationResponseFragmentDoc = gql`
    fragment RegularLocationResponse on SingleLocationResponse {
  errors {
    ...RegularError
  }
  location {
    ...RegularLocation
  }
}
    ${RegularErrorFragmentDoc}
${RegularLocationFragmentDoc}`;
export const RegularResidenceFragmentDoc = gql`
    fragment RegularResidence on Residence {
  res_id
  loc_id
  unit
  avg_rating
  avg_rent
  reviews {
    reviews {
      ...RegularReview
    }
    count
  }
}
    ${RegularReviewFragmentDoc}`;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  user_id
  first_name
  last_name
  email
  created_at
  updated_at
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on SingleUserResponse {
  errors {
    ...RegularError
  }
  user {
    ...RegularUser
  }
}
    ${RegularErrorFragmentDoc}
${RegularUserFragmentDoc}`;
export const RegularSingleReviewResponseFragmentDoc = gql`
    fragment RegularSingleReviewResponse on SingleReviewResponse {
  errors {
    ...RegularError
  }
  review {
    ...RegularReview
  }
}
    ${RegularErrorFragmentDoc}
${RegularReviewFragmentDoc}`;
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($options: RegisterInput!) {
  register(options: $options) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      options: // value for 'options'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const WriteReviewDocument = gql`
    mutation WriteReview($flags: [FlagInput!]!, $options: WriteReviewInput!) {
  writeReview(flags: $flags, options: $options) {
    ...RegularSingleReviewResponse
  }
}
    ${RegularSingleReviewResponseFragmentDoc}`;
export type WriteReviewMutationFn = Apollo.MutationFunction<WriteReviewMutation, WriteReviewMutationVariables>;

/**
 * __useWriteReviewMutation__
 *
 * To run a mutation, you first call `useWriteReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useWriteReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [writeReviewMutation, { data, loading, error }] = useWriteReviewMutation({
 *   variables: {
 *      flags: // value for 'flags'
 *      options: // value for 'options'
 *   },
 * });
 */
export function useWriteReviewMutation(baseOptions?: Apollo.MutationHookOptions<WriteReviewMutation, WriteReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<WriteReviewMutation, WriteReviewMutationVariables>(WriteReviewDocument, options);
      }
export type WriteReviewMutationHookResult = ReturnType<typeof useWriteReviewMutation>;
export type WriteReviewMutationResult = Apollo.MutationResult<WriteReviewMutation>;
export type WriteReviewMutationOptions = Apollo.BaseMutationOptions<WriteReviewMutation, WriteReviewMutationVariables>;
export const GetLocationsByPlaceIdDocument = gql`
    query GetLocationsByPlaceId($google_place_id: String!) {
  getLocationByPlaceId(google_place_id: $google_place_id) {
    ...RegularLocationResponse
  }
}
    ${RegularLocationResponseFragmentDoc}`;

/**
 * __useGetLocationsByPlaceIdQuery__
 *
 * To run a query within a React component, call `useGetLocationsByPlaceIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLocationsByPlaceIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLocationsByPlaceIdQuery({
 *   variables: {
 *      google_place_id: // value for 'google_place_id'
 *   },
 * });
 */
export function useGetLocationsByPlaceIdQuery(baseOptions: Apollo.QueryHookOptions<GetLocationsByPlaceIdQuery, GetLocationsByPlaceIdQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLocationsByPlaceIdQuery, GetLocationsByPlaceIdQueryVariables>(GetLocationsByPlaceIdDocument, options);
      }
export function useGetLocationsByPlaceIdLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLocationsByPlaceIdQuery, GetLocationsByPlaceIdQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLocationsByPlaceIdQuery, GetLocationsByPlaceIdQueryVariables>(GetLocationsByPlaceIdDocument, options);
        }
export type GetLocationsByPlaceIdQueryHookResult = ReturnType<typeof useGetLocationsByPlaceIdQuery>;
export type GetLocationsByPlaceIdLazyQueryHookResult = ReturnType<typeof useGetLocationsByPlaceIdLazyQuery>;
export type GetLocationsByPlaceIdQueryResult = Apollo.QueryResult<GetLocationsByPlaceIdQuery, GetLocationsByPlaceIdQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;