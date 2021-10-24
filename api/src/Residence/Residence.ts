import { ObjectType, Field, Float, Ctx, Root } from 'type-graphql';
import { Review } from '../Review/reviews';
import { MyContext } from '../types/types';

// @ObjectType()
// class Coords {
//     @Field()
//     lat: number;
//     @Field()
//     lng: number;
// }

@ObjectType()
export class Residence {
    @Field()
    res_id: number;

    @Field()
    loc_id: number;

    @Field()
    unit: string;

    // Review
    @Field(() => Float, { nullable: true })
    avg_rating?: number;

    @Field({ nullable: true })
    avg_rent?: number;

    // Features
    // @Field()
    // bed_count: number;

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
    //im mad
    // @Field(() => Location, { nullable: true })
    // async myLocation(
    //     @Root() residence: Residence,
    //     @Ctx() { dataSources }: MyContext
    // ): Promise<Location | undefined> {
    //     var r: Location | undefined = undefined;
    //     await dataSources.pgHandler
    //         .getLocationsById([residence.loc_id])
    //         .then((loc) => {
    //             if (loc.locations) r = loc.locations[0];
    //         });

    //     if (res.errors === undefined && res.locations !== undefined) {
    //         return res.locations[0];
    //     }
    //     return;
    // }

    @Field(() => String)
    created_at = new Date();

    @Field(() => String)
    updated_at = new Date();
}
