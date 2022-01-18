import { IsNumber, IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Review } from '../entities/Review';
import { Flags } from '../utils/types/Flag';

@InputType()
export class ReviewValidator implements Partial<Review> {
    @Field()
    @IsString()
    public feedback: string;

    @Field()
    @IsNumber()
    public rating: number;

    @Field(() => Flags)
    public flags: Flags;
}
