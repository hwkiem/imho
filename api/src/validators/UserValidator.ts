import { IsEmail, MinLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';
import { ImhoUser } from '../entities/ImhoUser';
import { Match } from './Match';

@InputType()
export class UserValidator implements Partial<ImhoUser> {
    @Field()
    @IsEmail()
    public email: string;

    @Field()
    @MinLength(6) // decide password complexity here
    public password: string;

    @Field()
    @Match('password')
    public confirmPassword: string;
}

@InputType()
export class PendingUserInput implements Partial<ImhoUser> {
    @Field()
    @IsEmail()
    public email: string;
}
