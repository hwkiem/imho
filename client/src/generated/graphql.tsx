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
};

export type Coords = {
  __typename?: 'Coords';
  lat: Scalars['Float'];
  lng: Scalars['Float'];
};

export type CreateResidenceInput = {
  google_place_id: Scalars['String'];
};

export type FieldError = {
  __typename?: 'FieldError';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  register: UserResponse;
  logout: UserResponse;
  login: UserResponse;
  deleteUser: UserResponse;
  createResidency: ResidenceResponse;
  writeReview: ReviewResponse;
};


export type MutationRegisterArgs = {
  options: RegisterInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['Float'];
};


export type MutationCreateResidencyArgs = {
  options: CreateResidenceInput;
};


export type MutationWriteReviewArgs = {
  options: WriteReviewInput;
};

export type PartialReview = {
  rating?: Maybe<Scalars['Float']>;
  rent?: Maybe<Scalars['Float']>;
};

export type PartialUser = {
  first_name?: Maybe<Scalars['String']>;
  last_name?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  me: UserResponse;
  getUsersbyId: UserResponse;
  getUsersLimit: UserResponse;
  getUsersObjFilter: UserResponse;
  getResidencesById: ResidenceResponse;
  getResidencesLimit: ResidenceResponse;
  getReviewsByUserId: ReviewResponse;
  getReviewsByResidenceId: ReviewResponse;
  getReviewsLimit: ReviewResponse;
  getReviewsObjFilter: ReviewResponse;
};


export type QueryGetUsersbyIdArgs = {
  user_ids: Array<Scalars['Int']>;
};


export type QueryGetUsersLimitArgs = {
  limit: Scalars['Int'];
};


export type QueryGetUsersObjFilterArgs = {
  obj: PartialUser;
};


export type QueryGetResidencesByIdArgs = {
  res_ids: Array<Scalars['Int']>;
};


export type QueryGetResidencesLimitArgs = {
  limit: Scalars['Int'];
};


export type QueryGetReviewsByUserIdArgs = {
  user_ids: Array<Scalars['Int']>;
};


export type QueryGetReviewsByResidenceIdArgs = {
  residence_ids: Array<Scalars['Int']>;
};


export type QueryGetReviewsLimitArgs = {
  limit: Scalars['Int'];
};


export type QueryGetReviewsObjFilterArgs = {
  obj: PartialReview;
};

export type RegisterInput = {
  email: Scalars['String'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  password: Scalars['String'];
};

export type ResidenceGql = {
  __typename?: 'ResidenceGQL';
  res_id: Scalars['Float'];
  full_address: Scalars['String'];
  apt_num: Scalars['String'];
  street_num: Scalars['String'];
  route: Scalars['String'];
  city: Scalars['String'];
  state: Scalars['String'];
  postal_code: Scalars['String'];
  coords: Coords;
  avg_rating?: Maybe<Scalars['Float']>;
  avg_rent?: Maybe<Scalars['Float']>;
  created_at: Scalars['String'];
  updated_at: Scalars['String'];
};

export type ResidenceResponse = {
  __typename?: 'ResidenceResponse';
  errors?: Maybe<Array<FieldError>>;
  residences?: Maybe<Array<ResidenceGql>>;
};

export type ReviewGql = {
  __typename?: 'ReviewGQL';
  res_id: Scalars['Int'];
  user_id: Scalars['Float'];
  rating: Scalars['Float'];
  rent: Scalars['Float'];
  created_at: Scalars['String'];
  updated_at: Scalars['String'];
};

export type ReviewResponse = {
  __typename?: 'ReviewResponse';
  errors?: Maybe<Array<FieldError>>;
  reviews?: Maybe<Array<ReviewGql>>;
};

export type UserGql = {
  __typename?: 'UserGQL';
  user_id: Scalars['Float'];
  first_name: Scalars['String'];
  last_name: Scalars['String'];
  email: Scalars['String'];
  created_at: Scalars['String'];
  updated_at: Scalars['String'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<FieldError>>;
  users?: Maybe<Array<UserGql>>;
};

export type WriteReviewInput = {
  res_id: Scalars['Float'];
  rating: Scalars['Float'];
  rent: Scalars['Float'];
};

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, users?: Maybe<Array<{ __typename?: 'UserGQL', user_id: number, first_name: string, last_name: string, email: string }>> } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, users?: Maybe<Array<{ __typename?: 'UserGQL', user_id: number }>> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'UserResponse', errors?: Maybe<Array<{ __typename?: 'FieldError', field: string, message: string }>>, users?: Maybe<Array<{ __typename?: 'UserGQL', user_id: number, first_name: string, last_name: string, email: string }>> } };


export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    errors {
      field
      message
    }
    users {
      user_id
      first_name
      last_name
      email
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
  logout {
    errors {
      field
      message
    }
    users {
      user_id
    }
  }
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
    errors {
      field
      message
    }
    users {
      user_id
      first_name
      last_name
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