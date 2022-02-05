import { Field, ObjectType } from 'type-graphql';
import { ApiResponse } from './Response';

@ObjectType()
class Success {
    @Field()
    success: boolean;
}

@ObjectType()
export class SuccessResponse extends ApiResponse(Success) {}
