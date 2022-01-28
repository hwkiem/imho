import { IsNumber, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Review } from '../entities/Review';
import { Flags } from '../utils/types/Flags';

export class ReviewValidator implements Partial<Review> {
    @IsString()
    public feedback: string;

    @IsNumber()
    public rating: number;
}

@InputType()
export class CreateReviewInput extends ReviewValidator {
    @Field()
    public feedback: string;

    @Field()
    public rating: number;

    @Field(() => Flags)
    public flagInput: Flags;
}
