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

@ObjectType()
class FlagWithCount {
    @Field()
    topic: string;
    @Field()
    cnt: number;
}

@ObjectType()
export class TopNFlagsResponse {
    @Field(() => [FlagWithCount])
    pros: FlagWithCount[];
    @Field(() => [FlagWithCount])
    cons: FlagWithCount[];
    @Field(() => [FlagWithCount])
    dbks: FlagWithCount[];
}
