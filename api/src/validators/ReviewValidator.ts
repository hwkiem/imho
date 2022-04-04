import { IsDivisibleBy, IsNumber, IsString, Max, Min } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Review } from '../entities/Review';
import { Flags } from '../utils/types/Flag';

export class ReviewValidator implements Partial<Review> {
    @IsString()
    public feedback: string;

    @IsNumber()
    @IsDivisibleBy(25)
    @Min(0)
    @Max(100)
    public rating: number;

    public flags: Flags;
}

@InputType()
export class CreateReviewInput extends ReviewValidator {
    @Field()
    public feedback: string;

    @Field()
    public rating: number;

    @Field(() => Flags)
    public flags: Flags;
}
