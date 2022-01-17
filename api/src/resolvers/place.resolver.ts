import { Place } from '../entities/Place';
import { Arg, Ctx, Query, Resolver } from 'type-graphql';
import { MyContext } from 'src/utils/context';
import { ApiResponse } from '../utils/types/Response';

class PlaceResponse extends ApiResponse(Place) {}

@Resolver(() => Place)
export class PlaceResolver {
    @Query(() => [Place])
    public async getPlace(
        @Ctx() ctx: MyContext,
        @Arg('placeId') placeId: string
    ): Promise<PlaceResponse> {
        try {
            const place = await ctx.em.findOneOrFail(Place, {
                google_place_id: placeId,
            });
            return { result: place };
        } catch (e) {
            console.error(e);
            return {
                errors: [
                    {
                        field: 'google_place_id',
                        error: 'Could not find matching place.',
                    },
                ],
            };
        }
    }
}
