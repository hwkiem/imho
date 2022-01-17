import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { Review } from '../entities/Review';
import { Flag } from '../utils/types/Flag';

@InputType()
export class ReviewValidator implements Partial<Review> {
    @Field()
    @IsString()
    public feedback: string;

    @Field(() => [Flag])
    public flags: Flag[];
}
