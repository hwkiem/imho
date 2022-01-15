import { LocationType } from '../enums/LocationType.enum';
import { IsEnum, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
class WriteReviewValidator {
    @Field()
    @IsString()
    public google_place_id: string;

    @Field(() => LocationType)
    @IsEnum(LocationType)
    public type: LocationType;

    @Field({ nullable: true })
    @IsString()
    public unit?: string;

    @Field()
    @IsString()
    public feedback: string;
}

export default WriteReviewValidator;
