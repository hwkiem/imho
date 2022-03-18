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

@ObjectType()
@InputType('ProFlagsInput')
export class ProFlags {
    @Field(() => [BathroomSubflagsPro], { nullable: true })
    bathroom: BathroomSubflagsPro[] | undefined;

    @Field(() => [KitchenSubflagsPro], { nullable: true })
    kitchen: KitchenSubflagsPro[] | undefined;

    @Field(() => [LocationSubflagsPro], { nullable: true })
    location: LocationSubflagsPro[] | undefined;

    @Field(() => [LandlordSubflagsPro], { nullable: true })
    landlord: LandlordSubflagsPro[] | undefined;

    @Field(() => [MiscPros], { nullable: true })
    misc: MiscPros[] | undefined;

    constructor() {
        // ensure unique arrays
        // TODO: be typescript clever and iterate over object members
        this.bathroom = this.bathroom ? [...new Set(this.bathroom)] : undefined;
        this.kitchen = this.kitchen ? [...new Set(this.kitchen)] : undefined;
        this.location = this.location ? [...new Set(this.location)] : undefined;
        this.landlord = this.landlord ? [...new Set(this.landlord)] : undefined;
        this.misc = this.misc ? [...new Set(this.misc)] : undefined;
    }
}

@ObjectType()
@InputType('ConFlagsInput')
export class ConFlags {
    @Field(() => [BathroomSubflagsCon], { nullable: true })
    bathroom: BathroomSubflagsCon[] | undefined;

    @Field(() => [MaintenanceSubflagsCon], { nullable: true })
    maintenance: MaintenanceSubflagsCon[] | undefined;

    @Field(() => [UtilitiesSubflagsCon], { nullable: true })
    utilities: UtilitiesSubflagsCon[] | undefined;

    @Field(() => [SmellSubflagsCon], { nullable: true })
    smells: SmellSubflagsCon[] | undefined;

    @Field(() => [LocationSubflagsCon], { nullable: true })
    location: LocationSubflagsCon[] | undefined;

    @Field(() => [LandlordSubflagsCon], { nullable: true })
    landlord: LandlordSubflagsCon[] | undefined;

    @Field(() => [MiscCons], { nullable: true })
    misc: MiscCons[] | undefined;

    constructor() {
        this.bathroom = this.bathroom ? [...new Set(this.bathroom)] : undefined;
        this.maintenance = this.maintenance
            ? [...new Set(this.maintenance)]
            : undefined;
        this.utilities = this.utilities
            ? [...new Set(this.utilities)]
            : undefined;
        this.smells = this.smells ? [...new Set(this.smells)] : undefined;
        this.location = this.location ? [...new Set(this.location)] : undefined;
        this.landlord = this.landlord ? [...new Set(this.landlord)] : undefined;
        this.misc = this.misc ? [...new Set(this.misc)] : undefined;
    }
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
class FlagWithCount {
    @Field()
    topic: string;
    // topic: keyof ProFlags | keyof ConFlags;
    @Field()
    cnt: number;
}

@ObjectType()
export class TopNFlagsResponse {
    @Field(() => [FlagWithCount])
    pros: FlagWithCount[];
    @Field(() => [FlagWithCount])
    cons: FlagWithCount[];
}
