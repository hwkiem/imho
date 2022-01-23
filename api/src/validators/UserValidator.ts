import { IsEmail, IsString, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { ImhoUser } from '../entities/ImhoUser';
import { Match } from './Match';

@InputType()
export class UserValidator implements Partial<ImhoUser> {
    @Field()
    @IsEmail()
    public email: string;

    @Field()
    @IsString()
    @MinLength(6) // decide password complexity here
    public password: string;

    @Field()
    @IsString()
    @Match('password')
    public confirmPassword: string;
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
