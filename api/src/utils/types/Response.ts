import { ClassType, Field, ObjectType } from 'type-graphql';
import { FieldError } from './FieldError';

export function ApiResponse<T>(TClass: ClassType<T>) {
    @ObjectType({ isAbstract: true })
    abstract class ApiResponseClass {
        @Field(
            () => {
                return TClass;
            },
            { nullable: true }
        )
        public result?: T;

        @Field(() => [FieldError], { nullable: true })
        public errors?: FieldError[];
    }
    return ApiResponseClass;
}

@ObjectType()
export class SuccessResponse extends ApiResponse(Boolean) {}
