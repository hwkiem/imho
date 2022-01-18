// import { LocationType } from '../enums/LocationType.enum';
import { Field, InputType } from 'type-graphql';
import { PlaceValidator } from './PlaceValidator';
import { ResidenceValidator } from './ResidenceValidator';
import { ReviewValidator } from './ReviewValidator';

@InputType()
export class WriteReviewInput {
    @Field(() => PlaceValidator)
    public placeInput: PlaceValidator;

    @Field(() => ResidenceValidator)
    public residenceInput: ResidenceValidator;

    @Field(() => ReviewValidator)
    public reviewInput: ReviewValidator;
}
