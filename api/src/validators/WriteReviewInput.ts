import { Field, InputType } from 'type-graphql';
import { CreatePlaceInput } from './PlaceValidator';
import { CreateResidenceInput } from './ResidenceValidator';
import { CreateReviewInput } from './ReviewValidator';

@InputType()
export class WriteReviewInput {
    @Field(() => CreatePlaceInput)
    public placeInput: CreatePlaceInput;

    @Field(() => CreateResidenceInput)
    public residenceInput: CreateResidenceInput;

    @Field(() => CreateReviewInput)
    public reviewInput: CreateReviewInput;
}
