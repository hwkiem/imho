import { IsEmail, IsString, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { ImhoUser } from '../entities/ImhoUser';
import { CreatePlaceInput } from './PlaceValidator';

export class UserValidator implements Partial<ImhoUser> {
    @IsEmail()
    public email: string;

    @IsString()
    @MinLength(6) // decide password complexity here
    public password?: string;
}
@InputType()
export class RegisterInput extends UserValidator {
    @Field()
    public email: string;

    @Field()
    public password: string;
}

@InputType()
export class ResetPasswordInput extends UserValidator {
    @Field()
    public password: string;
}

@InputType()
export class ChangePasswordInput {
    @Field()
    public old_password: string;
    @Field()
    public new_password: string;
}

@InputType()
export class PendingUserInput extends UserValidator {
    @Field()
    public email: string;
}

@InputType()
export class LoginInput extends UserValidator {
    @Field()
    public email: string;

    @Field()
    public password: string;
}

@InputType()
export class TrackPlaceInput {
    @Field(() => CreatePlaceInput)
    public placeInput: CreatePlaceInput;

    @Field(() => PendingUserInput)
    public userInput: PendingUserInput;
}
