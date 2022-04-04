import { Field, InputType, ObjectType } from 'type-graphql';
import {
    BathroomSubflagsPro,
    KitchenSubflagsPro,
    LocationSubflagsPro,
    LandlordSubflagsPro,
    MiscPros,
    BathroomSubflagsCon,
    MaintenanceSubflagsCon,
    UtilitiesSubflagsCon,
    SmellSubflagsCon,
    LocationSubflagsCon,
    LandlordSubflagsCon,
    MiscCons,
} from '../enums/FlagType.enum';
import { FieldError } from './FieldError';

@ObjectType()
@InputType('ProFlagsInput')
export class ProFlags {
    @Field(() => [BathroomSubflagsPro], { nullable: true })
    bathroom?: BathroomSubflagsPro[] | undefined;

    @Field(() => [KitchenSubflagsPro], { nullable: true })
    kitchen?: KitchenSubflagsPro[] | undefined;

    @Field(() => [LocationSubflagsPro], { nullable: true })
    location?: LocationSubflagsPro[] | undefined;

    @Field(() => [LandlordSubflagsPro], { nullable: true })
    landlord?: LandlordSubflagsPro[] | undefined;

    @Field(() => [MiscPros], { nullable: true })
    misc?: MiscPros[] | undefined;
}

@ObjectType()
@InputType('ConFlagsInput')
export class ConFlags {
    @Field(() => [BathroomSubflagsCon], { nullable: true })
    bathroom?: BathroomSubflagsCon[] | undefined;

    @Field(() => [MaintenanceSubflagsCon], { nullable: true })
    maintenance?: MaintenanceSubflagsCon[] | undefined;

    @Field(() => [UtilitiesSubflagsCon], { nullable: true })
    utilities?: UtilitiesSubflagsCon[] | undefined;

    @Field(() => [SmellSubflagsCon], { nullable: true })
    smells?: SmellSubflagsCon[] | undefined;

    @Field(() => [LocationSubflagsCon], { nullable: true })
    location?: LocationSubflagsCon[] | undefined;

    @Field(() => [LandlordSubflagsCon], { nullable: true })
    landlord?: LandlordSubflagsCon[] | undefined;

    @Field(() => [MiscCons], { nullable: true })
    misc?: MiscCons[] | undefined;
}

@ObjectType()
@InputType('FlagInput')
export class Flags {
    @Field(() => ProFlags)
    pros: ProFlags;

    @Field(() => ConFlags)
    cons: ConFlags;
}

@ObjectType()
export class FlagWithCount {
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

    @Field(() => FieldError, { nullable: true })
    error?: FieldError | undefined;
}
