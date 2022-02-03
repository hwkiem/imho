import { IsString } from 'class-validator';
import { Field, InputType } from 'type-graphql';

@InputType()
export class OtpValidator {
    @IsString()
    @Field()
    public email: string;

    @IsString()
    @Field()
    otp: string;
}

export const AddMinutesToDate = (date: Date, minutes: number): Date => {
    return new Date(date.getTime() + minutes * 60000);
};
