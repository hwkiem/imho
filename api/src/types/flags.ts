import { Field, InputType, ObjectType } from 'type-graphql';

// input types
@InputType()
class ProsInput {
    @Field()
    natural_light: boolean;
    @Field()
    neighborhood: boolean;
    @Field()
    amenities: boolean;
    @Field()
    appliances: boolean;
    @Field()
    good_landlord: boolean;
    @Field()
    pet_friendly: boolean;
    @Field()
    storage: boolean;
}

@InputType()
class ConsInput {
    @Field()
    bad_landlord: boolean;
    @Field()
    pet_unfriendly: boolean;
    @Field()
    shower: boolean;
    @Field()
    false_advertisement: boolean;
    @Field()
    noise: boolean;
    @Field()
    mold_or_mildew: boolean;
    @Field()
    pests: boolean;
    @Field()
    maintanence_issues: boolean;
    @Field()
    connectivity: boolean;
    @Field()
    safety: boolean;
}

@InputType()
class DbksInput {
    @Field()
    security_deposit: boolean;
    @Field()
    lease_issues: boolean;
    @Field()
    burglary: boolean;
    @Field()
    construction_harrassment: boolean;
    @Field()
    privacy: boolean;
    @Field()
    unresponsiveness: boolean;

    // [key: string]: boolean;
}

// object types
@ObjectType()
export class ProsType {
    @Field()
    natural_light: boolean;
    @Field()
    neighborhood: boolean;
    @Field()
    amenities: boolean;
    @Field()
    appliances: boolean;
    @Field()
    good_landlord: boolean;
    @Field()
    pet_friendly: boolean;
    @Field()
    storage: boolean;
}

@ObjectType()
export class ConsType {
    @Field()
    bad_landlord: boolean;
    @Field()
    pet_unfriendly: boolean;
    @Field()
    safety: boolean;
    @Field()
    shower: boolean;
    @Field()
    false_advertisement: boolean;
    @Field()
    noise: boolean;
    @Field()
    mold_or_mildew: boolean;
    @Field()
    pests: boolean;
    @Field()
    maintanence_issues: boolean;
    @Field()
    connectivity: boolean;
}

@ObjectType()
export class DbksType {
    @Field()
    security_deposit: boolean;
    @Field()
    lease_issues: boolean;
    @Field()
    burglary: boolean;
    @Field()
    construction_harrassment: boolean;
    @Field()
    privacy: boolean;
    @Field()
    unresponsiveness: boolean;
}

export interface Flags {
    pros: ProsType;
    cons: ConsType;
    dbks: DbksType;

    // getFlagsObj = () => {
    //     return { ...this.pros, ...this.cons, ...this.dbks };
    // };
}

@InputType()
export class FlagsInput implements Flags {
    @Field(() => ProsInput)
    pros: ProsInput;
    @Field(() => ConsInput)
    cons: ConsInput;
    @Field(() => DbksInput)
    dbks: DbksInput;
}

@ObjectType()
export class FlagsType implements Flags {
    @Field(() => ProsType)
    pros: ProsType;
    @Field(() => ConsType)
    cons: ConsType;
    @Field(() => DbksType)
    dbks: DbksType;
}
