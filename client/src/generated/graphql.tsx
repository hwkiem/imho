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

export type AllAttributes = {
  rating?: Maybe<Scalars['Float']>;
  rent?: Maybe<Scalars['Float']>;
  air_conditioning?: Maybe<Scalars['Boolean']>;
  heat?: Maybe<Scalars['Boolean']>;
  stove?: Maybe<StoveType>;
  pool?: Maybe<Scalars['Boolean']>;
  gym?: Maybe<Scalars['Boolean']>;
  garbage_disposal?: Maybe<Scalars['Boolean']>;
  dishwasher?: Maybe<Scalars['Boolean']>;
  parking?: Maybe<Scalars['Boolean']>;
  doorman?: Maybe<Scalars['Boolean']>;
  lease_term: DateRangeInput;
  pet_friendly?: Maybe<Scalars['Boolean']>;
  laundry?: Maybe<LaundryType>;
  backyard?: Maybe<Scalars['Boolean']>;
  bath_count?: Maybe<Scalars['Float']>;
  bedroom_count?: Maybe<Scalars['Int']>;
};

export type ChangePasswordInput = {
  email: Scalars['String'];
  old_password: Scalars['String'];
  new_password: Scalars['String'];
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
  start_date: Scalars['DateTime'];
  end_date: Scalars['DateTime'];
};

export type DateRangeInput = {
  start_date: Scalars['DateTime'];
  end_date: Scalars['DateTime'];
};


export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type GeoBoundaryInput = {
  xMax: Scalars['Float'];
  xMin: Scalars['Float'];
  yMax: Scalars['Float'];
  yMin: Scalars['Float'];
};

/** Laundry options */
export enum LaundryType {
  InUnit = 'IN_UNIT',
  Building = 'BUILDING',
  None = 'NONE'
}

export type Location = {
  __typename?: 'Location';
  loc_id: Scalars['Float'];
  google_place_id: Scalars['String'];
  full_address: Scalars['String'];
  street_num: Scalars['String'];
  route: Scalars['String'];
  city: Scalars['String'];
  state: Scalars['String'];
  postal_code: Scalars['String'];
  coords: Coords;
  avg_rent?: Maybe<Scalars['Float']>;
  avg_rating?: Maybe<Scalars['Float']>;
  pool?: Maybe<Scalars['Boolean']>;
  gym?: Maybe<Scalars['Boolean']>;
  parking?: Maybe<Scalars['Boolean']>;
  doorman?: Maybe<Scalars['Boolean']>;
  pet_friendly?: Maybe<Scalars['Boolean']>;
  laundry?: Maybe<LaundryType>;
  backyard?: Maybe<Scalars['Boolean']>;
  myResidences?: Maybe<Array<Residence>>;
};

export type LocationQueryOptions = {
  limit?: Maybe<Scalars['Int']>;
  sort_params?: Maybe<LocationSortByInput>;
  partial_location?: Maybe<PartialLocation>;
};

export type LocationResponse = {
  __typename?: 'LocationResponse';
  errors?: Maybe<Array<FieldError>>;
  locations?: Maybe<Array<Location>>;
};

/** Field by which to sort location query results */
export enum LocationSortBy {
  Rent = 'RENT',
  Rating = 'RATING',
  Id = 'ID'
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
  register: SingleUserResponse;
  logout: SingleUserResponse;
  login: SingleUserResponse;
  changeMyPassword: UserResponse;
  deleteUser: SingleUserResponse;
  createResidence: SingleResidenceResponse;
  writeReview: SingleReviewResponse;
  updateMyReviewOverwrite: SingleReviewResponse;
  updateMyReviewGeneric: ReviewResponse;
  createLocation: SingleLocationResponse;
};


export type MutationRegisterArgs = {
  options: RegisterInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationChangeMyPasswordArgs = {
  args: ChangePasswordInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['Float'];
};


export type MutationCreateResidenceArgs = {
  options: CreateResidenceInput;
};


export type MutationWriteReviewArgs = {
  options: WriteReviewInput;
};


export type MutationUpdateMyReviewOverwriteArgs = {
  res_id: Scalars['Float'];
  changes: AllAttributes;
};


export type MutationUpdateMyReviewGenericArgs = {
  res_id: Scalars['Float'];
  changes: AllAttributes;
};


export type MutationCreateLocationArgs = {
  place_id: Scalars['String'];
};

export type PartialLocation = {
  loc_id?: Maybe<Scalars['Float']>;
  google_place_id?: Maybe<Scalars['String']>;
  street_num?: Maybe<Scalars['String']>;
  route?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  postal_code?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
};

export type PartialResidence = {
  res_id?: Maybe<Scalars['Float']>;
  google_place_id?: Maybe<Scalars['String']>;
  apt_num?: Maybe<Scalars['String']>;
  street_num?: Maybe<Scalars['String']>;
  route?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  postal_code?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
  avg_rent?: Maybe<Scalars['Float']>;
  avg_rating?: Maybe<Scalars['Float']>;
};

export type PartialReview = {
  rating?: Maybe<Scalars['Float']>;
  rent?: Maybe<Scalars['Float']>;
  air_conditioning?: Maybe<Scalars['Boolean']>;
  heat?: Maybe<Scalars['Boolean']>;
  stove?: Maybe<StoveType>;
  pool?: Maybe<Scalars['Boolean']>;
  gym?: Maybe<Scalars['Boolean']>;
  garbage_disposal?: Maybe<Scalars['Boolean']>;
  dishwasher?: Maybe<Scalars['Boolean']>;
  parking?: Maybe<Scalars['Boolean']>;
  doorman?: Maybe<Scalars['Boolean']>;
  pet_friendly?: Maybe<Scalars['Boolean']>;
  laundry?: Maybe<LaundryType>;
  backyard?: Maybe<Scalars['Boolean']>;
  bath_count?: Maybe<Scalars['Float']>;
  bedroom_count?: Maybe<Scalars['Float']>;
  lease_term?: Maybe<DateRangeInput>;
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
  me: SingleUserResponse;
  getUsersbyId: UserResponse;
  getUsersGeneric: UserResponse;
  getResidencesById: ResidenceResponse;
  getResidencesGeneric: ResidenceResponse;
  getReviewsGeneric: ReviewResponse;
  getReviewsByUserId: ReviewResponse;
  getReviewsByResidenceId: ReviewResponse;
  getLocationsById: LocationResponse;
  getLocationsByGeoScope: LocationResponse;
  getLocationsGeneric: LocationResponse;
  getLocationsBoundingBox: LocationResponse;
  placeIdFromAddress: PlaceIdResponse;
};


export type QueryGetUsersbyIdArgs = {
  user_ids: Array<Scalars['Int']>;
};


export type QueryGetUsersGenericArgs = {
  options?: Maybe<UserQueryOptions>;
};


export type QueryGetResidencesByIdArgs = {
  res_ids: Array<Scalars['Int']>;
};


export type QueryGetResidencesGenericArgs = {
  options?: Maybe<ResidenceQueryOptions>;
};


export type QueryGetReviewsGenericArgs = {
  options?: Maybe<ReviewQueryOptions>;
};


export type QueryGetReviewsByUserIdArgs = {
  user_ids: Array<Scalars['Int']>;
};


export type QueryGetReviewsByResidenceIdArgs = {
  residence_ids: Array<Scalars['Int']>;
};


export type QueryGetLocationsByIdArgs = {
  loc_ids: Array<Scalars['Int']>;
};


export type QueryGetLocationsByGeoScopeArgs = {
  options?: Maybe<LocationQueryOptions>;
  place_id: Scalars['String'];
};


export type QueryGetLocationsGenericArgs = {
  options?: Maybe<LocationQueryOptions>;
};


export type QueryGetLocationsBoundingBoxArgs = {
  options?: Maybe<LocationQueryOptions>;
  perimeter: GeoBoundaryInput;
};


export type QueryPlaceIdFromAddressArgs = {
  address: Scalars['String'];
};

/** OrderBy options */
export enum QueryOrderChoice {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type RegisterInput = {
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  password: Scalars['String'];
};

export type Residence = {
  __typename?: 'Residence';
  res_id: Scalars['Float'];
  loc_id: Scalars['Float'];
  unit: Scalars['String'];
  avg_rating?: Maybe<Scalars['Float']>;
  avg_rent?: Maybe<Scalars['Float']>;
  air_conditioning?: Maybe<Scalars['Boolean']>;
  heat?: Maybe<Scalars['Boolean']>;
  stove?: Maybe<StoveType>;
  pool?: Maybe<Scalars['Boolean']>;
  gym?: Maybe<Scalars['Boolean']>;
  garbage_disposal?: Maybe<Scalars['Boolean']>;
  dishwasher?: Maybe<Scalars['Boolean']>;
  parking?: Maybe<Scalars['Boolean']>;
  doorman?: Maybe<Scalars['Boolean']>;
  pet_friendly?: Maybe<Scalars['Boolean']>;
  laundry?: Maybe<LaundryType>;
  backyard?: Maybe<Scalars['Boolean']>;
  bath_count?: Maybe<Scalars['Float']>;
  bedroom_count?: Maybe<Scalars['Float']>;
  myReviews?: Maybe<Array<Review>>;
  created_at: Scalars['String'];
  updated_at: Scalars['String'];
};

export type ResidenceQueryOptions = {
  limit?: Maybe<Scalars['Int']>;
  sort_params?: Maybe<ResidenceSortByInput>;
  partial_residence?: Maybe<PartialResidence>;
};

export type ResidenceResponse = {
  __typename?: 'ResidenceResponse';
  errors?: Maybe<Array<FieldError>>;
  residences?: Maybe<Array<Residence>>;
};

/** Field by which to sort residence query results */
export enum ResidenceSortBy {
  Rent = 'RENT',
  Rating = 'RATING',
  Id = 'ID'
}

export type ResidenceSortByInput = {
  attribute: ResidenceSortBy;
  sort: QueryOrderChoice;
};

export type Review = {
  __typename?: 'Review';
  res_id: Scalars['Float'];
  user_id: Scalars['Float'];
  rating: Scalars['Float'];
  rent?: Maybe<Scalars['Float']>;
  myResidence?: Maybe<Residence>;
  air_conditioning?: Maybe<Scalars['Boolean']>;
  heat?: Maybe<Scalars['Boolean']>;
  stove?: Maybe<StoveType>;
  pool?: Maybe<Scalars['Boolean']>;
  gym?: Maybe<Scalars['Boolean']>;
  garbage_disposal?: Maybe<Scalars['Boolean']>;
  dishwasher?: Maybe<Scalars['Boolean']>;
  parking?: Maybe<Scalars['Boolean']>;
  doorman?: Maybe<Scalars['Boolean']>;
  pet_friendly?: Maybe<Scalars['Boolean']>;
  laundry?: Maybe<LaundryType>;
  backyard?: Maybe<Scalars['Boolean']>;
  bath_count?: Maybe<Scalars['Float']>;
  bedroom_count?: Maybe<Scalars['Float']>;
  lease_term?: Maybe<DateRange>;
  created_at: Scalars['String'];
  updated_at: Scalars['String'];
};

export type ReviewQueryOptions = {
  limit?: Maybe<Scalars['Int']>;
  sort_params?: Maybe<ReviewSortByInput>;
  partial_review?: Maybe<PartialReview>;
};

export type ReviewResponse = {
  __typename?: 'ReviewResponse';
  errors?: Maybe<Array<FieldError>>;
  reviews?: Maybe<Array<Review>>;
};

/** Field by which to sort review query results */
export enum ReviewSortBy {
  Rent = 'RENT',
  Rating = 'RATING',
  UserId = 'USER_ID'
}

export type ReviewSortByInput = {
  attribute: ReviewSortBy;
  sort: QueryOrderChoice;
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

/** Stove options */
export enum StoveType {
  Gas = 'GAS',
  Electric = 'ELECTRIC'
}

export type User = {
  __typename?: 'User';
  user_id: Scalars['Float'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  email: Scalars['String'];
  profession?: Maybe<Scalars['String']>;
  myReviews?: Maybe<Array<Review>>;
  created_at: Scalars['String'];
  updated_at: Scalars['String'];
};

export type UserQueryOptions = {
  limit?: Maybe<Scalars['Int']>;
  sort_params?: Maybe<UserSortByInput>;
  partial_user?: Maybe<PartialUser>;
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
  google_place_id: Scalars['String'];
  unit: Scalars['String'];
  review_details: AllAttributes;
};

export type RegularErrorFragment = { __typename?: 'FieldError', field: string, message: string };

export type RegularLocationFragment = { __typename?: 'Location', loc_id: number, full_address: string, avg_rent?: Maybe<number>, avg_rating?: Maybe<number>, coords: { __typename?: 'Coords', lat: number, lng: number }, myResidences?: Maybe<Array<{ __typename?: 'Residence', res_id: number, unit: string, avg_rating?: Maybe<number>, avg_rent?: Maybe<number>, myReviews?: Maybe<Array<{ __typename?: 'Review', res_id: number, user_id: number, rent?: Maybe<number>, rating: number }>> }>> };

export type RegularLocationResponseFragment = { __typename?: 'LocationResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, locations?: Maybe<Array<{ __typename?: 'Location', loc_id: number, full_address: string, avg_rent?: Maybe<number>, avg_rating?: Maybe<number>, coords: { __typename?: 'Coords', lat: number, lng: number }, myResidences?: Maybe<Array<{ __typename?: 'Residence', res_id: number, unit: string, avg_rating?: Maybe<number>, avg_rent?: Maybe<number>, myReviews?: Maybe<Array<{ __typename?: 'Review', res_id: number, user_id: number, rent?: Maybe<number>, rating: number }>> }>> }>> };

export type RegularResidenceFragment = { __typename?: 'Residence', res_id: number, unit: string, avg_rating?: Maybe<number>, avg_rent?: Maybe<number>, myReviews?: Maybe<Array<{ __typename?: 'Review', res_id: number, user_id: number, rent?: Maybe<number>, rating: number }>> };

export type RegularReviewFragment = { __typename?: 'Review', res_id: number, user_id: number, rent?: Maybe<number>, rating: number };

export type RegularReviewResponseFragment = { __typename?: 'ReviewResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, reviews?: Maybe<Array<{ __typename?: 'Review', res_id: number, user_id: number, rent?: Maybe<number>, rating: number }>> };

export type RegularUserFragment = { __typename?: 'User', user_id: number, first_name: string, last_name: string, email: string, created_at: string, updated_at: string };

export type RegularUserResponseFragment = { __typename?: 'SingleUserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', user_id: number, first_name: string, last_name: string, email: string, created_at: string, updated_at: string }> };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'SingleUserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', user_id: number, first_name: string, last_name: string, email: string, created_at: string, updated_at: string }> } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'SingleUserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', user_id: number, first_name: string, last_name: string, email: string, created_at: string, updated_at: string }> } };

export type RegisterMutationVariables = Exact<{
  options: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'SingleUserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', user_id: number, first_name: string, last_name: string, email: string, created_at: string, updated_at: string }> } };

export type WriteReviewMutationVariables = Exact<{
  options: WriteReviewInput;
}>;


export type WriteReviewMutation = { __typename?: 'Mutation', writeReview: { __typename?: 'SingleReviewResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, review?: Maybe<{ __typename?: 'Review', res_id: number, user_id: number, rent?: Maybe<number>, rating: number }> } };

export type GetLocationsBoundingBoxQueryVariables = Exact<{
  options?: Maybe<LocationQueryOptions>;
  perimeter: GeoBoundaryInput;
}>;


export type GetLocationsBoundingBoxQuery = { __typename?: 'Query', getLocationsBoundingBox: { __typename?: 'LocationResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, locations?: Maybe<Array<{ __typename?: 'Location', loc_id: number, full_address: string, avg_rent?: Maybe<number>, avg_rating?: Maybe<number>, coords: { __typename?: 'Coords', lat: number, lng: number }, myResidences?: Maybe<Array<{ __typename?: 'Residence', res_id: number, unit: string, avg_rating?: Maybe<number>, avg_rent?: Maybe<number>, myReviews?: Maybe<Array<{ __typename?: 'Review', res_id: number, user_id: number, rent?: Maybe<number>, rating: number }>> }>> }>> } };

export type GetLocationsByGeoScopeQueryVariables = Exact<{
  options?: Maybe<LocationQueryOptions>;
  place_id: Scalars['String'];
}>;


export type GetLocationsByGeoScopeQuery = { __typename?: 'Query', getLocationsByGeoScope: { __typename?: 'LocationResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, locations?: Maybe<Array<{ __typename?: 'Location', loc_id: number, full_address: string, avg_rent?: Maybe<number>, avg_rating?: Maybe<number>, coords: { __typename?: 'Coords', lat: number, lng: number }, myResidences?: Maybe<Array<{ __typename?: 'Residence', res_id: number, unit: string, avg_rating?: Maybe<number>, avg_rent?: Maybe<number>, myReviews?: Maybe<Array<{ __typename?: 'Review', res_id: number, user_id: number, rent?: Maybe<number>, rating: number }>> }>> }>> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'SingleUserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, user?: Maybe<{ __typename?: 'User', user_id: number, first_name: string, last_name: string, email: string, created_at: string, updated_at: string }> } };

export const RegularErrorFragmentDoc = gql`
    fragment RegularError on FieldError {
  field
  message
}
    `;
export const RegularReviewFragmentDoc = gql`
    fragment RegularReview on Review {
  res_id
  user_id
  rent
  rating
}
    `;
export const RegularResidenceFragmentDoc = gql`
    fragment RegularResidence on Residence {
  res_id
  unit
  avg_rating
  avg_rent
  myReviews {
    ...RegularReview
  }
}
    ${RegularReviewFragmentDoc}`;
export const RegularLocationFragmentDoc = gql`
    fragment RegularLocation on Location {
  loc_id
  full_address
  coords {
    lat
    lng
  }
  avg_rent
  avg_rating
  myResidences {
    ...RegularResidence
  }
}
    ${RegularResidenceFragmentDoc}`;
export const RegularLocationResponseFragmentDoc = gql`
    fragment RegularLocationResponse on LocationResponse {
  errors {
    ...RegularError
  }
  locations {
    ...RegularLocation
  }
}
    ${RegularErrorFragmentDoc}
${RegularLocationFragmentDoc}`;
export const RegularReviewResponseFragmentDoc = gql`
    fragment RegularReviewResponse on ReviewResponse {
  errors {
    ...RegularError
  }
  reviews {
    ...RegularReview
  }
}
    ${RegularErrorFragmentDoc}
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
    mutation WriteReview($options: WriteReviewInput!) {
  writeReview(options: $options) {
    errors {
      ...RegularError
    }
    review {
      ...RegularReview
    }
  }
}
    ${RegularErrorFragmentDoc}
${RegularReviewFragmentDoc}`;
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
export const GetLocationsBoundingBoxDocument = gql`
    query GetLocationsBoundingBox($options: LocationQueryOptions, $perimeter: GeoBoundaryInput!) {
  getLocationsBoundingBox(options: $options, perimeter: $perimeter) {
    ...RegularLocationResponse
  }
}
    ${RegularLocationResponseFragmentDoc}`;

/**
 * __useGetLocationsBoundingBoxQuery__
 *
 * To run a query within a React component, call `useGetLocationsBoundingBoxQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLocationsBoundingBoxQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLocationsBoundingBoxQuery({
 *   variables: {
 *      options: // value for 'options'
 *      perimeter: // value for 'perimeter'
 *   },
 * });
 */
export function useGetLocationsBoundingBoxQuery(baseOptions: Apollo.QueryHookOptions<GetLocationsBoundingBoxQuery, GetLocationsBoundingBoxQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLocationsBoundingBoxQuery, GetLocationsBoundingBoxQueryVariables>(GetLocationsBoundingBoxDocument, options);
      }
export function useGetLocationsBoundingBoxLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLocationsBoundingBoxQuery, GetLocationsBoundingBoxQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLocationsBoundingBoxQuery, GetLocationsBoundingBoxQueryVariables>(GetLocationsBoundingBoxDocument, options);
        }
export type GetLocationsBoundingBoxQueryHookResult = ReturnType<typeof useGetLocationsBoundingBoxQuery>;
export type GetLocationsBoundingBoxLazyQueryHookResult = ReturnType<typeof useGetLocationsBoundingBoxLazyQuery>;
export type GetLocationsBoundingBoxQueryResult = Apollo.QueryResult<GetLocationsBoundingBoxQuery, GetLocationsBoundingBoxQueryVariables>;
export const GetLocationsByGeoScopeDocument = gql`
    query GetLocationsByGeoScope($options: LocationQueryOptions, $place_id: String!) {
  getLocationsByGeoScope(options: $options, place_id: $place_id) {
    ...RegularLocationResponse
  }
}
    ${RegularLocationResponseFragmentDoc}`;

/**
 * __useGetLocationsByGeoScopeQuery__
 *
 * To run a query within a React component, call `useGetLocationsByGeoScopeQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLocationsByGeoScopeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLocationsByGeoScopeQuery({
 *   variables: {
 *      options: // value for 'options'
 *      place_id: // value for 'place_id'
 *   },
 * });
 */
export function useGetLocationsByGeoScopeQuery(baseOptions: Apollo.QueryHookOptions<GetLocationsByGeoScopeQuery, GetLocationsByGeoScopeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLocationsByGeoScopeQuery, GetLocationsByGeoScopeQueryVariables>(GetLocationsByGeoScopeDocument, options);
      }
export function useGetLocationsByGeoScopeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLocationsByGeoScopeQuery, GetLocationsByGeoScopeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLocationsByGeoScopeQuery, GetLocationsByGeoScopeQueryVariables>(GetLocationsByGeoScopeDocument, options);
        }
export type GetLocationsByGeoScopeQueryHookResult = ReturnType<typeof useGetLocationsByGeoScopeQuery>;
export type GetLocationsByGeoScopeLazyQueryHookResult = ReturnType<typeof useGetLocationsByGeoScopeLazyQuery>;
export type GetLocationsByGeoScopeQueryResult = Apollo.QueryResult<GetLocationsByGeoScopeQuery, GetLocationsByGeoScopeQueryVariables>;
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