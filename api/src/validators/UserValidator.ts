import { IsEmail, IsString, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { ImhoUser } from '../entities/ImhoUser';
import { PlaceValidator } from './PlaceValidator';

@InputType()
export class UserValidator implements Partial<ImhoUser> {
    @Field()
    @IsEmail()
    public email: string;

    @Field()
    @IsString()
    @MinLength(6) // decide password complexity here
    public password: string;
}

@InputType()
export class PendingUserInput implements Partial<UserValidator> {
    @Field()
    @IsEmail()
    public email: string;
}

@InputType()
export class LoginInput implements Partial<UserValidator> {
    @Field()
    @IsEmail()
    public email: string;

    @Field()
    @IsString()
    public password: string;
}

@InputType()
export class TrackPlaceInput {
    @Field(() => PlaceValidator)
    public placeInput: PlaceValidator;

    @Field(() => PendingUserInput)
    public userInput: PendingUserInput;
}
