import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type ChangePasswordInput = {
  email: Scalars['String'];
  new_password: Scalars['String'];
  old_password: Scalars['String'];
};

export type ConsInput = {
  bad_landlord: Scalars['Boolean'];
  connectivity: Scalars['Boolean'];
  false_advertisement: Scalars['Boolean'];
  maintenance_issues: Scalars['Boolean'];
  mold_or_mildew: Scalars['Boolean'];
  noise: Scalars['Boolean'];
  pests: Scalars['Boolean'];
  pet_unfriendly: Scalars['Boolean'];
  safety: Scalars['Boolean'];
  shower: Scalars['Boolean'];
};

export type ConsType = {
  __typename?: 'ConsType';
  bad_landlord: Scalars['Boolean'];
  connectivity: Scalars['Boolean'];
  false_advertisement: Scalars['Boolean'];
  maintenance_issues: Scalars['Boolean'];
  mold_or_mildew: Scalars['Boolean'];
  noise: Scalars['Boolean'];
  pests: Scalars['Boolean'];
  pet_unfriendly: Scalars['Boolean'];
  safety: Scalars['Boolean'];
  shower: Scalars['Boolean'];
};

export type Coords = {
  __typename?: 'Coords';
  lat: Scalars['Float'];
  lng: Scalars['Float'];
};

export type DbksInput = {
  burglary: Scalars['Boolean'];
  construction_harrassment: Scalars['Boolean'];
  lease_issues: Scalars['Boolean'];
  privacy: Scalars['Boolean'];
  security_deposit: Scalars['Boolean'];
  unresponsiveness: Scalars['Boolean'];
};

export type DbksType = {
  __typename?: 'DbksType';
  burglary: Scalars['Boolean'];
  construction_harrassment: Scalars['Boolean'];
  lease_issues: Scalars['Boolean'];
  privacy: Scalars['Boolean'];
  security_deposit: Scalars['Boolean'];
  unresponsiveness: Scalars['Boolean'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type FlagsInput = {
  cons: ConsInput;
  dbks: DbksInput;
  pros: ProsInput;
};

export type FlagsType = {
  __typename?: 'FlagsType';
  cons: ConsType;
  dbks: DbksType;
  pros: ProsType;
};

export type GeoBoundaryInput = {
  xMax: Scalars['Float'];
  xMin: Scalars['Float'];
  yMax: Scalars['Float'];
  yMin: Scalars['Float'];
};

export type Location = {
  __typename?: 'Location';
  avg_rating?: Maybe<Scalars['Float']>;
  category: LocationCategory;
  formatted_address: Scalars['String'];
  google_place_id: Scalars['String'];
  imho_score?: Maybe<Scalars['Float']>;
  landlord_email?: Maybe<Scalars['String']>;
  loc_id: Scalars['Float'];
  residences?: Maybe<Array<Residence>>;
};


export type LocationResidencesArgs = {
  options?: InputMaybe<ResidenceQueryOptions>;
};

/** Two categories of location - single or multi residence */
export enum LocationCategory {
  ApartmentBuilding = 'APARTMENT_BUILDING',
  House = 'HOUSE'
}

export type LocationQueryOptions = {
  limit?: InputMaybe<Scalars['Int']>;
  partial_location?: InputMaybe<PartialLocation>;
  sort_params?: InputMaybe<LocationSortByInput>;
};

export type LocationResponse = {
  __typename?: 'LocationResponse';
  errors?: Maybe<Array<FieldError>>;
  locations?: Maybe<Array<Location>>;
};

/** Field by which to sort location query results */
export enum LocationSortBy {
  Id = 'ID',
  Rating = 'RATING'
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
  options: WriteReviewInput;
};

export type PartialLocation = {
  city?: InputMaybe<Scalars['String']>;
  google_place_id?: InputMaybe<Scalars['String']>;
  loc_id?: InputMaybe<Scalars['Float']>;
  postal_code?: InputMaybe<Scalars['String']>;
  route?: InputMaybe<Scalars['String']>;
  state?: InputMaybe<Scalars['String']>;
  street_num?: InputMaybe<Scalars['String']>;
};

export type PartialResidence = {
  avg_rating?: InputMaybe<Scalars['Float']>;
  avg_rent?: InputMaybe<Scalars['Float']>;
  google_place_id?: InputMaybe<Scalars['String']>;
  res_id?: InputMaybe<Scalars['Float']>;
  unit?: InputMaybe<Scalars['String']>;
};

export type PartialReview = {
  rating?: InputMaybe<Scalars['Float']>;
  rent?: InputMaybe<Scalars['Float']>;
};

export type PartialUser = {
  first_name?: InputMaybe<Scalars['String']>;
  last_name?: InputMaybe<Scalars['String']>;
};

export type ProsInput = {
  amenities: Scalars['Boolean'];
  appliances: Scalars['Boolean'];
  good_landlord: Scalars['Boolean'];
  natural_light: Scalars['Boolean'];
  neighborhood: Scalars['Boolean'];
  pet_friendly: Scalars['Boolean'];
  storage: Scalars['Boolean'];
};

export type ProsType = {
  __typename?: 'ProsType';
  amenities: Scalars['Boolean'];
  appliances: Scalars['Boolean'];
  good_landlord: Scalars['Boolean'];
  natural_light: Scalars['Boolean'];
  neighborhood: Scalars['Boolean'];
  pet_friendly: Scalars['Boolean'];
  storage: Scalars['Boolean'];
};

export type Query = {
  __typename?: 'Query';
  getLocationByPlaceId: SingleLocationResponse;
  getLocationsBoundingBox: LocationResponse;
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
};


export type QueryGetLocationByPlaceIdArgs = {
  google_place_id: Scalars['String'];
};


export type QueryGetLocationsBoundingBoxArgs = {
  options?: InputMaybe<LocationQueryOptions>;
  perimeter: GeoBoundaryInput;
};


export type QueryGetLocationsByIdArgs = {
  loc_ids: Array<Scalars['Int']>;
};


export type QueryGetLocationsGenericArgs = {
  options?: InputMaybe<LocationQueryOptions>;
};


export type QueryGetResidencesByIdArgs = {
  res_ids: Array<Scalars['Int']>;
};


export type QueryGetResidencesGenericArgs = {
  options?: InputMaybe<ResidenceQueryOptions>;
};


export type QueryGetReviewsByResidenceIdArgs = {
  residence_ids: Array<Scalars['Int']>;
};


export type QueryGetReviewsByUserIdArgs = {
  user_ids: Array<Scalars['Int']>;
};


export type QueryGetReviewsGenericArgs = {
  options?: InputMaybe<ReviewQueryOptions>;
};


export type QueryGetUsersGenericArgs = {
  options?: InputMaybe<UserQueryOptions>;
};


export type QueryGetUsersbyIdArgs = {
  user_ids: Array<Scalars['Int']>;
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
  avg_rating?: Maybe<Scalars['Float']>;
  created_at: Scalars['String'];
  loc_id: Scalars['Float'];
  res_id: Scalars['Float'];
  reviews?: Maybe<Array<Review>>;
  unit: Scalars['String'];
  updated_at: Scalars['String'];
};


export type ResidenceReviewsArgs = {
  options?: InputMaybe<ReviewQueryOptions>;
};

export type ResidenceQueryOptions = {
  limit?: InputMaybe<Scalars['Int']>;
  partial_residence?: InputMaybe<PartialResidence>;
  sort_params?: InputMaybe<ResidenceSortByInput>;
};

export type ResidenceResponse = {
  __typename?: 'ResidenceResponse';
  errors?: Maybe<Array<FieldError>>;
  residences?: Maybe<Array<Residence>>;
};

/** Field by which to sort residence query results */
export enum ResidenceSortBy {
  Id = 'ID',
  Rating = 'RATING'
}

export type ResidenceSortByInput = {
  attribute: ResidenceSortBy;
  sort: QueryOrderChoice;
};

export type Review = {
  __typename?: 'Review';
  author?: Maybe<User>;
  created_at: Scalars['String'];
  feedback?: Maybe<Scalars['String']>;
  flags: FlagsType;
  rating: Scalars['Float'];
  residence?: Maybe<Residence>;
  rev_id: Scalars['Float'];
  updated_at: Scalars['String'];
};

export type ReviewFieldsInput = {
  feedback: Scalars['String'];
  flags: FlagsInput;
  rating: Scalars['Float'];
};

export type ReviewQueryOptions = {
  limit?: InputMaybe<Scalars['Int']>;
  partial_review?: InputMaybe<PartialReview>;
  sort_params?: InputMaybe<ReviewSortByInput>;
};

export type ReviewResponse = {
  __typename?: 'ReviewResponse';
  errors?: Maybe<Array<FieldError>>;
  reviews?: Maybe<Array<Review>>;
};

/** Field by which to sort review query results */
export enum ReviewSortBy {
  Rating = 'RATING',
  Rent = 'RENT',
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
  options?: InputMaybe<ReviewQueryOptions>;
};

export type UserQueryOptions = {
  limit?: InputMaybe<Scalars['Int']>;
  partial_user?: InputMaybe<PartialUser>;
  sort_params?: InputMaybe<UserSortByInput>;
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

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'SingleUserResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, user?: { __typename?: 'User', email: string } | null | undefined } };

export type WriteReviewMutationVariables = Exact<{
  options: WriteReviewInput;
}>;


export type WriteReviewMutation = { __typename?: 'Mutation', writeReview: { __typename?: 'SingleReviewResponse', errors?: Array<{ __typename?: 'FieldError', field: string, message: string }> | null | undefined, review?: { __typename?: 'Review', rev_id: number, created_at: string } | null | undefined } };


export const MeDocument = gql`
    query Me {
  me {
    errors {
      field
      message
    }
    user {
      email
    }
  }
}
    `;

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
export const WriteReviewDocument = gql`
    mutation WriteReview($options: WriteReviewInput!) {
  writeReview(options: $options) {
    errors {
      field
      message
    }
    review {
      rev_id
      created_at
    }
  }
}
    `;
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