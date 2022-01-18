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

export type Flags = {
  __typename?: 'Flags';
  cons: Array<ConFlagTypes>;
  dbks: Array<DbkFlagTypes>;
  pros: Array<ProFlagTypes>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addReview: ReviewResponse;
};


export type MutationAddReviewArgs = {
  input: WriteReviewInput;
};

export type Place = {
  __typename?: 'Place';
  createdAt: Scalars['DateTime'];
  formatted_address: Scalars['String'];
  google_place_id: Scalars['String'];
  id: Scalars['ID'];
  residences: Array<Residence>;
  topNFlags?: Maybe<Flags>;
  type: PlaceType;
  updatedAt: Scalars['DateTime'];
};

export type PlaceResponse = {
  __typename?: 'PlaceResponse';
  errors?: Maybe<FieldError>;
  result?: Maybe<Place>;
};

/** Type of the this address */
export enum PlaceType {
  Multi = 'MULTI',
  Single = 'SINGLE'
}

export type PlaceValidator = {
  formatted_address: Scalars['String'];
  google_place_id: Scalars['String'];
  type: PlaceType;
};

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
};


export type QueryGetPlaceArgs = {
  placeId: Scalars['String'];
};


export type QueryGetReviewArgs = {
  id: Scalars['String'];
};

export type Residence = {
  __typename?: 'Residence';
  createdAt: Scalars['DateTime'];
  id: Scalars['ID'];
  place: Place;
  reviews: Array<Review>;
  unit?: Maybe<Scalars['String']>;
  updatedAt: Scalars['DateTime'];
};

export type ResidenceValidator = {
  unit: Scalars['String'];
};

export type Review = {
  __typename?: 'Review';
  createdAt: Scalars['DateTime'];
  feedback: Scalars['String'];
  flags: Flags;
  id: Scalars['ID'];
  rating: Scalars['Float'];
  residence?: Maybe<Residence>;
  updatedAt: Scalars['DateTime'];
};

export type ReviewResponse = {
  __typename?: 'ReviewResponse';
  errors?: Maybe<FieldError>;
  result?: Maybe<Review>;
};

export type ReviewValidator = {
  feedback: Scalars['String'];
  flags: FlagInput;
  rating: Scalars['Float'];
};

export type WriteReviewInput = {
  placeInput: PlaceValidator;
  residenceInput: ResidenceValidator;
  reviewInput: ReviewValidator;
};

export type AddReviewMutationVariables = Exact<{
  input: WriteReviewInput;
}>;


export type AddReviewMutation = { __typename?: 'Mutation', addReview: { __typename?: 'ReviewResponse', result?: { __typename?: 'Review', id: string, createdAt: any, feedback: string, residence?: { __typename?: 'Residence', id: string, createdAt: any, unit?: string | null | undefined, place: { __typename?: 'Place', id: string, createdAt: any, google_place_id: string } } | null | undefined, flags: { __typename?: 'Flags', pros: Array<ProFlagTypes>, cons: Array<ConFlagTypes>, dbks: Array<DbkFlagTypes> } } | null | undefined, errors?: { __typename?: 'FieldError', field: string, error: string } | null | undefined } };


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