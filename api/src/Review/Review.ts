import { ObjectType, Field, Float } from 'type-graphql';
import { LaundryType, StoveType } from '../types/enum_types';
import { DateRange } from '../types/object_types';

@ObjectType()
export class Review {
    @Field()
    res_id: number;

    @Field()
    user_id: number;

    @Field()
    rating?: number;

    @Field({ nullable: true })
    rent?: number;

    // new bools
    @Field({ nullable: true })
    air_conditioning?: boolean;

    @Field({ nullable: true })
    heat?: boolean;

    @Field(() => StoveType, { nullable: true })
    stove?: StoveType;

    @Field({ nullable: true })
    pool?: boolean;

    @Field({ nullable: true })
    gym?: boolean;

    @Field({ nullable: true })
    garbage_disposal?: boolean;

    @Field({ nullable: true })
    dishwasher?: boolean;

    @Field({ nullable: true })
    parking?: boolean;

    @Field({ nullable: true })
    doorman?: boolean;

    @Field({ nullable: true })
    pet_friendly?: boolean;

    @Field(() => LaundryType, { nullable: true })
    laundry?: LaundryType;

    @Field({ nullable: true })
    backyard?: boolean;

    @Field(() => Float, { nullable: true })
    bath_count?: number;

    @Field({ nullable: true })
    bedroom_count?: number;

    @Field(() => DateRange, { nullable: true })
    lease_term?: DateRange;

    @Field(() => String)
    created_at = new Date();

    @Field(() => String)
    updated_at = new Date();
}
