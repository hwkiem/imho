import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class FieldError {
    @Field()
    field: string;

    @Field()
    error: string;
}

@ObjectType()
export class OtpResponse {
    @Field()
    otp?: string;

    @Field(() => FieldError)
    error?: FieldError;
}
