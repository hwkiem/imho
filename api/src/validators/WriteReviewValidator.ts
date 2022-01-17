// import { LocationType } from '../enums/LocationType.enum';
import { Field, InputType } from 'type-graphql';
import { PlaceValidator } from './PlaceValidator';
import { ResidenceValidator } from './ResidenceValidator';
import { ReviewValidator } from './ReviewValidator';

@InputType()
export class WriteReviewValidator {
    @Field(() => PlaceValidator)
    public placeValidator: PlaceValidator;

    @Field(() => ResidenceValidator)
    public residenceValidator: ResidenceValidator;

    @Field(() => ReviewValidator)
    public reviewValidator: ReviewValidator;
}
