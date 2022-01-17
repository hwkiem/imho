import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class ResidenceValidator {
    @Field()
    @IsString()
    public unit: string;
}
