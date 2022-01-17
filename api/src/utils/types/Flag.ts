import { Field, InputType, ObjectType } from 'type-graphql';
import { FlagTypes } from '../enums/FlagType.enum';

@ObjectType()
@InputType('FlagInput')
export class Flag {
    @Field(() => FlagTypes)
    topic: FlagTypes;
}
