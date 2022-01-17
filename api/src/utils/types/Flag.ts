import { Field, ObjectType } from 'type-graphql';
import { FlagTypes } from '../enums/FlagType.enum';

@ObjectType()
export default class Flag {
    @Field(() => FlagTypes)
    topic: FlagTypes;
}
