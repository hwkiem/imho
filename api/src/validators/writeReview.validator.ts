// import { LocationType } from '../enums/LocationType.enum';
import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import LocationValidator from './location.validator';

@InputType()
class WriteReviewValidator {
    public locationValidator: LocationValidator;
    // @Field()
    // @IsString()
    // public google_place_id: string;

    // @Field(() => LocationType)
    // @IsEnum(LocationType)
    // public type: LocationType;

    @Field({ nullable: true })
    @IsString()
    public unit?: string;

    @Field()
    @IsString()
    public feedback: string;
}

export default WriteReviewValidator;
