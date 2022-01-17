import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class ReviewValidator {
    @Field()
    @IsString()
    public feedback: string;
}
