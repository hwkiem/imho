import { Field } from 'type-graphql';

export class FieldError {
    @Field()
    field: string;

    @Field()
    error: string;
}
