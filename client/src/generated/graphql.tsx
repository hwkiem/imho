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
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

/** All the positive flag topics */
export enum ConFlagTypes {
  BadLandlord = 'BAD_LANDLORD',
  Connectivity = 'CONNECTIVITY',
  FalseAd = 'FALSE_AD',
  Maintenance = 'MAINTENANCE',
  MoldMildew = 'MOLD_MILDEW',
  Noise = 'NOISE',
  Pests = 'PESTS',
  PetUnfriendly = 'PET_UNFRIENDLY',
  Shower = 'SHOWER',
  Unsafe = 'UNSAFE'
}

export type CreatePlaceInput = {
  formatted_address: Scalars['String'];
  google_place_id: Scalars['String'];
  type: PlaceType;
};

export type CreateResidenceInput = {
  unit?: InputMaybe<Scalars['String']>;
};

export type CreateReviewInput = {
  feedback: Scalars['String'];
  flagInput: FlagInput;
  rating: Scalars['Float'];
};

/** All the dealbreakers */
export enum DbkFlagTypes {
  Burglary = 'BURGLARY',
  Construction = 'CONSTRUCTION',
  Deposit = 'DEPOSIT',
  Lease = 'LEASE',
  Mushroom = 'MUSHROOM',
  Privacy = 'PRIVACY',
  Unresponsive = 'UNRESPONSIVE'
}

export type FieldError = {
  __typename?: 'FieldError';
  error: Scalars['String'];
  field: Scalars['String'];
};

export type FlagInput = {
  cons: Array<ConFlagTypes>;
  dbks: Array<DbkFlagTypes>;
  pros: Array<ProFlagTypes>;
};

export type FlagWithCount = {
  __typename?: 'FlagWithCount';
  cnt: Scalars['Float'];
  topic: Scalars['String'];
};

export type Flags = {
  __typename?: 'Flags';
  cons: Array<ConFlagTypes>;
  dbks: Array<DbkFlagTypes>;
  pros: Array<ProFlagTypes>;
};

export type ImhoUser = {
  __typename?: 'ImhoUser';
  createdAt: Scalars['DateTime'];
  email: Scalars['String'];
  id: Scalars['ID'];
  myTrackedPlaces: Array<Place>;
  reviews: Array<Review>;
  updatedAt: Scalars['DateTime'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addReview: ReviewResponse;
  createPendingUser: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  registerUser: UserResponse;
  trackPlace: UserResponse;
};


export type MutationAddReviewArgs = {
  input: WriteReviewInput;
};


export type MutationCreatePendingUserArgs = {
  input: PendingUserInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRegisterUserArgs = {
  input: RegisterInput;
};


export type MutationTrackPlaceArgs = {
  input: TrackPlaceInput;
};

export type PendingUserInput = {
  email: Scalars['String'];
};

export type Place = {
  __typename?: 'Place';
  averageRating?: Maybe<Scalars['Float']>;
  createdAt: Scalars['DateTime'];
  formatted_address: Scalars['String'];
  google_place_id: Scalars['String'];
  id: Scalars['ID'];
  residences: Array<Residence>;
  topNFlags?: Maybe<TopNFlagsResponse>;
  type: PlaceType;
  updatedAt: Scalars['DateTime'];
  usersTrackingThisPlace: Array<ImhoUser>;
};


export type PlaceTopNFlagsArgs = {
  n: Scalars['Float'];
};

export type PlaceResponse = {
  __typename?: 'PlaceResponse';
  errors?: Maybe<Array<FieldError>>;
  result?: Maybe<Place>;
};

/** Type of the this address */
export enum PlaceType {
  Multi = 'MULTI',
  Single = 'SINGLE'
}

/** All the negative flag topics */
export enum ProFlagTypes {
  Amenities = 'AMENITIES',
  Appliances = 'APPLIANCES',
  GoodLandlord = 'GOOD_LANDLORD',
  NaturalLight = 'NATURAL_LIGHT',
  Neighborhood = 'NEIGHBORHOOD',
  PetFriendly = 'PET_FRIENDLY',
  Shower = 'SHOWER',
  Storage = 'STORAGE'
}

export type Query = {
  __typename?: 'Query';
  getPlace: PlaceResponse;
  getReview: ReviewResponse;
  getUser: UserResponse;
  me: UserResponse;
};


export type QueryGetPlaceArgs = {
  placeId: Scalars['String'];
};


export type QueryGetReviewArgs = {
  id: Scalars['String'];
};


export type QueryGetUserArgs = {
  userId: Scalars['String'];
};

export type RegisterInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Residence = {
  __typename?: 'Residence';
  averageRating?: Maybe<Scalars['Float']>;
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  place: Place;
  reviews: Array<Review>;
  unit?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};

export type Review = {
  __typename?: 'Review';
  author?: Maybe<ImhoUser>;
  createdAt: Scalars['DateTime'];
  feedback?: Maybe<Scalars['String']>;
  flags?: Maybe<Flags>;
  id: Scalars['ID'];
  rating: Scalars['Float'];
  residence?: Maybe<Residence>;
  updatedAt: Scalars['DateTime'];
};

export type ReviewResponse = {
  __typename?: 'ReviewResponse';
  errors?: Maybe<Array<FieldError>>;
  result?: Maybe<Review>;
};

export type TopNFlagsResponse = {
  __typename?: 'TopNFlagsResponse';
  cons: Array<FlagWithCount>;
  dbks: Array<FlagWithCount>;
  pros: Array<FlagWithCount>;
};

export type TrackPlaceInput = {
  placeInput: CreatePlaceInput;
  userInput: PendingUserInput;
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  result?: Maybe<ImhoUser>;
};

export type WriteReviewInput = {
  placeInput: CreatePlaceInput;
  residenceInput: CreateResidenceInput;
  reviewInput: CreateReviewInput;
};

export type CreatePendingUserMutationVariables = Exact<{
  input: PendingUserInput;
}>;


export type CreatePendingUserMutation = { __typename?: 'Mutation', createPendingUser: { __typename?: 'UserResponse', result?: { __typename?: 'ImhoUser', id: string, email: string, createdAt: any } | null, errors?: Array<{ __typename?: 'FieldError', field: string, error: string }> | null } };

export type GetPlaceQueryVariables = Exact<{
  placeId: Scalars['String'];
}>;


export type GetPlaceQuery = { __typename?: 'Query', getPlace: { __typename?: 'PlaceResponse', result?: { __typename?: 'Place', id: string, createdAt: any, google_place_id: string, formatted_address: string, averageRating?: number | null, topNFlags?: { __typename?: 'TopNFlagsResponse', pros: Array<{ __typename?: 'FlagWithCount', topic: string, cnt: number }>, cons: Array<{ __typename?: 'FlagWithCount', topic: string, cnt: number }>, dbks: Array<{ __typename?: 'FlagWithCount', topic: string, cnt: number }> } | null, residences: Array<{ __typename?: 'Residence', id: string, createdAt: any, unit?: string | null, averageRating?: number | null, reviews: Array<{ __typename?: 'Review', id: string, createdAt: any, rating: number, feedback?: string | null }> }> } | null, errors?: Array<{ __typename?: 'FieldError', field: string, error: string }> | null } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', result?: { __typename?: 'ImhoUser', id: string, createdAt: any, email: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, error: string }> | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: boolean };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'UserResponse', result?: { __typename?: 'ImhoUser', id: string, createdAt: any, email: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, error: string }> | null } };

export type RegisterUserMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterUserMutation = { __typename?: 'Mutation', registerUser: { __typename?: 'UserResponse', result?: { __typename?: 'ImhoUser', id: string, createdAt: any, email: string } | null, errors?: Array<{ __typename?: 'FieldError', field: string, error: string }> | null } };

export type TrackPlaceMutationVariables = Exact<{
  input: TrackPlaceInput;
}>;


export type TrackPlaceMutation = { __typename?: 'Mutation', trackPlace: { __typename?: 'UserResponse', result?: { __typename?: 'ImhoUser', id: string, email: string, myTrackedPlaces: Array<{ __typename?: 'Place', id: string, formatted_address: string }> } | null, errors?: Array<{ __typename?: 'FieldError', field: string, error: string }> | null } };

export type AddReviewMutationVariables = Exact<{
  input: WriteReviewInput;
}>;


export type AddReviewMutation = { __typename?: 'Mutation', addReview: { __typename?: 'ReviewResponse', result?: { __typename?: 'Review', id: string, createdAt: any, feedback?: string | null, residence?: { __typename?: 'Residence', id: string, createdAt: any, unit?: string | null, place: { __typename?: 'Place', id: string, createdAt: any, google_place_id: string } } | null, flags?: { __typename?: 'Flags', pros: Array<ProFlagTypes>, cons: Array<ConFlagTypes>, dbks: Array<DbkFlagTypes> } | null } | null, errors?: Array<{ __typename?: 'FieldError', field: string, error: string }> | null } };


export const CreatePendingUserDocument = gql`
    mutation CreatePendingUser($input: PendingUserInput!) {
  createPendingUser(input: $input) {
    result {
      id
      email
      createdAt
    }
    errors {
      field
      error
    }
  }
}
    `;
export type CreatePendingUserMutationFn = Apollo.MutationFunction<CreatePendingUserMutation, CreatePendingUserMutationVariables>;

/**
 * __useCreatePendingUserMutation__
 *
 * To run a mutation, you first call `useCreatePendingUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePendingUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPendingUserMutation, { data, loading, error }] = useCreatePendingUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreatePendingUserMutation(baseOptions?: Apollo.MutationHookOptions<CreatePendingUserMutation, CreatePendingUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePendingUserMutation, CreatePendingUserMutationVariables>(CreatePendingUserDocument, options);
      }
export type CreatePendingUserMutationHookResult = ReturnType<typeof useCreatePendingUserMutation>;
export type CreatePendingUserMutationResult = Apollo.MutationResult<CreatePendingUserMutation>;
export type CreatePendingUserMutationOptions = Apollo.BaseMutationOptions<CreatePendingUserMutation, CreatePendingUserMutationVariables>;
export const GetPlaceDocument = gql`
    query GetPlace($placeId: String!) {
  getPlace(placeId: $placeId) {
    result {
      id
      createdAt
      google_place_id
      formatted_address
      averageRating
      topNFlags(n: 5) {
        pros {
          topic
          cnt
        }
        cons {
          topic
          cnt
        }
        dbks {
          topic
          cnt
        }
      }
      residences {
        id
        createdAt
        unit
        averageRating
        reviews {
          id
          createdAt
          rating
          feedback
        }
      }
    }
    errors {
      field
      error
    }
  }
}
    `;

/**
 * __useGetPlaceQuery__
 *
 * To run a query within a React component, call `useGetPlaceQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlaceQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlaceQuery({
 *   variables: {
 *      placeId: // value for 'placeId'
 *   },
 * });
 */
export function useGetPlaceQuery(baseOptions: Apollo.QueryHookOptions<GetPlaceQuery, GetPlaceQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPlaceQuery, GetPlaceQueryVariables>(GetPlaceDocument, options);
      }
export function useGetPlaceLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPlaceQuery, GetPlaceQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPlaceQuery, GetPlaceQueryVariables>(GetPlaceDocument, options);
        }
export type GetPlaceQueryHookResult = ReturnType<typeof useGetPlaceQuery>;
export type GetPlaceLazyQueryHookResult = ReturnType<typeof useGetPlaceLazyQuery>;
export type GetPlaceQueryResult = Apollo.QueryResult<GetPlaceQuery, GetPlaceQueryVariables>;
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    result {
      id
      createdAt
      email
    }
    errors {
      field
      error
    }
  }
}
    `;
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
  logout
}
    `;
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
export const MeDocument = gql`
    query Me {
  me {
    result {
      id
      createdAt
      email
    }
    errors {
      field
      error
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
export const RegisterUserDocument = gql`
    mutation RegisterUser($input: RegisterInput!) {
  registerUser(input: $input) {
    result {
      id
      createdAt
      email
    }
    errors {
      field
      error
    }
  }
}
    `;
export type RegisterUserMutationFn = Apollo.MutationFunction<RegisterUserMutation, RegisterUserMutationVariables>;

/**
 * __useRegisterUserMutation__
 *
 * To run a mutation, you first call `useRegisterUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerUserMutation, { data, loading, error }] = useRegisterUserMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterUserMutation(baseOptions?: Apollo.MutationHookOptions<RegisterUserMutation, RegisterUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterUserMutation, RegisterUserMutationVariables>(RegisterUserDocument, options);
      }
export type RegisterUserMutationHookResult = ReturnType<typeof useRegisterUserMutation>;
export type RegisterUserMutationResult = Apollo.MutationResult<RegisterUserMutation>;
export type RegisterUserMutationOptions = Apollo.BaseMutationOptions<RegisterUserMutation, RegisterUserMutationVariables>;
export const TrackPlaceDocument = gql`
    mutation TrackPlace($input: TrackPlaceInput!) {
  trackPlace(input: $input) {
    result {
      id
      email
      myTrackedPlaces {
        id
        formatted_address
      }
    }
    errors {
      field
      error
    }
  }
}
    `;
export type TrackPlaceMutationFn = Apollo.MutationFunction<TrackPlaceMutation, TrackPlaceMutationVariables>;

/**
 * __useTrackPlaceMutation__
 *
 * To run a mutation, you first call `useTrackPlaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useTrackPlaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [trackPlaceMutation, { data, loading, error }] = useTrackPlaceMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useTrackPlaceMutation(baseOptions?: Apollo.MutationHookOptions<TrackPlaceMutation, TrackPlaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<TrackPlaceMutation, TrackPlaceMutationVariables>(TrackPlaceDocument, options);
      }
export type TrackPlaceMutationHookResult = ReturnType<typeof useTrackPlaceMutation>;
export type TrackPlaceMutationResult = Apollo.MutationResult<TrackPlaceMutation>;
export type TrackPlaceMutationOptions = Apollo.BaseMutationOptions<TrackPlaceMutation, TrackPlaceMutationVariables>;
export const AddReviewDocument = gql`
    mutation AddReview($input: WriteReviewInput!) {
  addReview(input: $input) {
    result {
      id
      createdAt
      residence {
        id
        createdAt
        unit
        place {
          id
          createdAt
          google_place_id
        }
      }
      feedback
      flags {
        pros
        cons
        dbks
      }
    }
    errors {
      field
      error
    }
  }
}
    `;
export type AddReviewMutationFn = Apollo.MutationFunction<AddReviewMutation, AddReviewMutationVariables>;

/**
 * __useAddReviewMutation__
 *
 * To run a mutation, you first call `useAddReviewMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddReviewMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addReviewMutation, { data, loading, error }] = useAddReviewMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useAddReviewMutation(baseOptions?: Apollo.MutationHookOptions<AddReviewMutation, AddReviewMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddReviewMutation, AddReviewMutationVariables>(AddReviewDocument, options);
      }
export type AddReviewMutationHookResult = ReturnType<typeof useAddReviewMutation>;
export type AddReviewMutationResult = Apollo.MutationResult<AddReviewMutation>;
export type AddReviewMutationOptions = Apollo.BaseMutationOptions<AddReviewMutation, AddReviewMutationVariables>;