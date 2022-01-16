import { Field, ObjectType } from 'type-graphql';
import { FieldError } from './FieldError';

@ObjectType({ isAbstract: true })
export class Response<T> {
    @Field({ nullable: true })
    public result?: T;

    @Field(() => FieldError, { nullable: true })
    public errors?: FieldError[];
}
