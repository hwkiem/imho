import { Location } from '../entities/Location';
import { Arg, Ctx, Query, Resolver } from 'type-graphql';
import { MyContext } from 'src/utils/context';
import { Response } from 'src/entities/Response';

@Resolver(() => Location)
export class LocationResolver {
    @Query(() => [Location])
    public async getLocation(
        @Ctx() ctx: MyContext,
        @Arg('placeId') placeId: string
    ): Promise<Response<Location>> {
        try {
            const location = await ctx.em.findOneOrFail(Location, {
                google_place_id: placeId,
            });
            return { result: location };
        } catch (e) {
            console.error(e);
            return {
                errors: [
                    {
                        field: 'google_place_id',
                        error: 'Could not find matching location.',
                    },
                ],
            };
        }
    }
}
