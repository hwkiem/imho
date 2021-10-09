import { ObjectType, Field, Float, Ctx, Root } from 'type-graphql';
import { Review } from '../Review/reviews';
import { LaundryType, StoveType } from '../types/enum_types';
import { MyContext } from '../types/types';

@ObjectType()
export class Residence {
    @Field()
    res_id: number;

    @Field()
    loc_id: number;

    @Field()
    unit: string;

    // aggregates
    // averages
    @Field(() => Float, { nullable: true })
    avg_rating?: number;

    @Field(() => Float, { nullable: true })
    avg_rent?: number;

    // modes
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

    //

    @Field(() => [Review], { nullable: true })
    async myReviews(
        @Root() residence: Residence,
        @Ctx() { dataSources }: MyContext
    ): Promise<Review[] | undefined> {
        const res = await dataSources.pgHandler.getReviewsByResidenceId([
            residence.res_id,
        ]);
        if (!res.errors && res.reviews) {
            return res.reviews;
        }
        return;
    }

    @Field(() => String)
    created_at = new Date();

    @Field(() => String)
    updated_at = new Date();
}
