import { Place } from '../entities/Place';
import { Arg, Ctx, ObjectType, Query, Resolver } from 'type-graphql';
import { MyContext } from '../utils/context';
import { ApiResponse } from '../utils/types/Response';
import { Service } from 'typedi';
import { Residence } from '../entities/Residence';

@ObjectType()
export class PlaceResponse extends ApiResponse(Place) {}
export class ResidenceResponse extends ApiResponse(Residence) {}
@Service()
@Resolver(() => Place)
export class PlaceResolver {
    @Query(() => PlaceResponse)
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
