import { Residence } from '../entities/Residence';
import { Review } from '../entities/Review';
import { GraphQLResolveInfo } from 'graphql';
import fieldsToRelations from 'graphql-fields-to-relations';
import { Arg, Ctx, Info, Mutation, Query, Resolver } from 'type-graphql';
import { MyContext } from '../utils/context';
import ReviewValidator from '../validators/review.validator';
import WriteReviewValidator from 'src/validators/writeReview.validator';

@Resolver(() => Review)
export class ReviewResolver {
    @Query(() => [Review])
    public async getReviewsByPlaceId(
        @Ctx() ctx: MyContext,
        @Arg('placeId') placeId: string
    ): Promise<Review[]> {
        const review = await ctx.em.findOne(Review, {
            residence: { location: { google_place_id: placeId } },
        });
        return [review];
    }

    @Mutation(() => Review)
    public async addReview(
        @Arg('input') input: WriteReviewValidator,
        @Ctx() ctx: MyContext,
        @Info() info: GraphQLResolveInfo
    ): Promise<Review> {
        const book = new Review(input);
        try {
            book.residence = await ctx.em
                .getRepository(Residence)
                .findOneOrFail(
                    { google_place_id: resId },
                    fieldsToRelations(info, { root: 'residence' })
                );
        } catch (e) {}

        await ctx.em.persist(book).flush();
        return book;
    }

    @Mutation(() => Review)
    public async updateReview(
        @Arg('input') input: ReviewValidator,
        @Arg('id') id: string,
        @Ctx() ctx: MyContext,
        @Info() info: GraphQLResolveInfo
    ): Promise<Review> {
        const relationPaths = fieldsToRelations(info);
        const book = await ctx.em
            .getRepository(Review)
            .findOneOrFail({ id }, relationPaths);
        book.assign(input);
        await ctx.em.persist(book).flush();
        return book;
    }

    @Mutation(() => Boolean)
    public async deleteReview(
        @Arg('id') id: string,
        @Ctx() ctx: MyContext
    ): Promise<boolean> {
        const book = await ctx.em.getRepository(Review).findOneOrFail({ id });
        await ctx.em.getRepository(Review).remove(book).flush();
        return true;
    }
}
