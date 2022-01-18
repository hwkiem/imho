import { Field, InputType, ObjectType } from 'type-graphql';
import { ConFlagType, DbkFlagType, ProFlagType } from '../enums/FlagType.enum';

@ObjectType()
@InputType('FlagInput')
export class Flags {
    @Field(() => [ProFlagType])
    pros: ProFlagType[];

    @Field(() => [ConFlagType])
    cons: ConFlagType[];

    @Field(() => [DbkFlagType])
    dbks: DbkFlagType[];
}
