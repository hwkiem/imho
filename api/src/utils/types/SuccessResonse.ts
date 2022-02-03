import { Field, ObjectType } from 'type-graphql';
import { FieldError } from './FieldError';

@ObjectType()
export class SuccessResponse {
    @Field()
    success: boolean;

    @Field({ nullable: true })
    apiError?: FieldError;
}
