import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
class ReviewValidator {
    @Field()
    @IsString()
    public feedback: string;
}

export default ReviewValidator;
