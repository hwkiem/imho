import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class ValidateOtpInput {
    @IsString()
    @Field()
    public email: string;

    @IsString()
    @Field()
    otp: string;
}
