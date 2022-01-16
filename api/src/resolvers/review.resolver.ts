import { Residence } from '../entities/Residence';
import { Review } from '../entities/Review';
import { GraphQLResolveInfo } from 'graphql';
import fieldsToRelations from 'graphql-fields-to-relations';
import { Arg, Ctx, Info, Mutation, Query, Resolver } from 'type-graphql';
import { MyContext } from '../utils/context';
import { Location } from '../entities/Location';
import WriteReviewValidator from 'src/validators/writeReview.validator';

@Resolver(() => Review)
export class ReviewResolver {
    // @Query(() => [Review])
    // public async getReviewsByPlaceId(
    //     @Ctx() ctx: MyContext,
    //     @Arg('placeId') placeId: string
    // ): Promise<Review[]> {
    //     const review = await ctx.em.findOne(Review, {
    //         residence: { location: { google_place_id: placeId } },
    //     });
    //     return [review];
    // }

    @Mutation(() => Review)
    public async addReview(
        @Arg('input') input: WriteReviewValidator,
        @Ctx() { em }: MyContext,
        @Info() info: GraphQLResolveInfo
    ): Promise<Review> {
        // does the location/residence exist?

        const location: Location | null = await em
            .getRepository(Location)
            .findOne({ google_place_id: input.google_place_id });
        // create
        // if (typeof location == null) {

        // }

        const book = new Review(input);
        try {
            book.residence = await em
                .getRepository(Residence)
                .findOneOrFail(
                    { google_place_id: resId },
                    fieldsToRelations(info, { root: 'residence' })
                );
        } catch (e) {
            console.log(e);
        }

        await em.persist(book).flush();
        return book;
    }

    // @Mutation(() => Review)
    // public async updateReview(
    //     @Arg('input') input: ReviewValidator,
    //     @Arg('id') id: string,
    //     @Ctx() ctx: MyContext,
    //     @Info() info: GraphQLResolveInfo
    // ): Promise<Review> {
    //     const relationPaths = fieldsToRelations(info);
    //     const book = await ctx.em
    //         .getRepository(Review)
    //         .findOneOrFail({ id }, relationPaths);
    //     book.assign(input);
    //     await ctx.em.persist(book).flush();
    //     return book;
    // }

    // @Mutation(() => Boolean)
    // public async deleteReview(
    //     @Arg('id') id: string,
    //     @Ctx() ctx: MyContext
    // ): Promise<boolean> {
    //     const book = await ctx.em.getRepository(Review).findOneOrFail({ id });
    //     await ctx.em.getRepository(Review).remove(book).flush();
    //     return true;
    // }
}
