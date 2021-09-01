import { ObjectType, Field, Float, Ctx, Root } from 'type-graphql';
import { Residence } from '../Residence/residence';
import { MyContext } from '../types';

@ObjectType()
export class Review {
    @Field()
    res_id: number;

    @Field()
    user_id: number;

    @Field(() => Float, { nullable: true })
    rating?: number;

    @Field({ nullable: true })
    rent?: number;

    @Field(() => Residence, { nullable: true })
    async residence(
        @Root() review: Review,
        @Ctx() { dataSources }: MyContext
    ): Promise<Residence | undefined> {
        const res = await dataSources.pgHandler.getResidencesById([
            review.res_id,
        ]);
        if (res.errors === undefined && res.residences !== undefined) {
            return res.residences[0];
        }
        return;
    }

    @Field(() => String)
    created_at = new Date();

    @Field(() => String)
    updated_at = new Date();
}
