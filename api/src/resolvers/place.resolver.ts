import { Place } from '../entities/Place';
import {
    Arg,
    Ctx,
    FieldResolver,
    ObjectType,
    Query,
    Resolver,
    Root,
} from 'type-graphql';
import { MyContext } from '../utils/context';
import { ApiResponse } from '../utils/types/Response';
import { Flags, TopNFlagsResponse } from '../utils/types/Flag';
import {
    ConFlagType,
    DbkFlagType,
    ProFlagType,
} from '../utils/enums/FlagType.enum';
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

    // Field resolver and some sort of validation on topFlags length
    @FieldResolver(() => TopNFlagsResponse, { nullable: true })
    async topNFlags(
        @Root() place: Place,
        @Arg('n') n: number
    ): Promise<TopNFlagsResponse> {
        const counter = {
            pros: {} as { [key in ProFlagType]: number },
            cons: {} as { [key in ConFlagType]: number },
            dbks: {} as { [key in DbkFlagType]: number },
        };
        if (!place.residenceCollection.isInitialized()) {
            await place.residenceCollection.init();
        }
        for (const res of place.residenceCollection) {
            if (!res.reviewCollection.isInitialized()) {
                await res.reviewCollection.init();
            }
            for (const rev of res.reviewCollection) {
                const flags: Flags = JSON.parse(rev.flag_string);
                for (const f of flags.pros) {
                    counter.pros[f] = counter.pros[f] ? ++counter.pros[f] : 1;
                }
                for (const f of flags.cons) {
                    counter.cons[f] = counter.cons[f] ? ++counter.cons[f] : 1;
                }
                for (const f of flags.dbks) {
                    counter.dbks[f] = counter.dbks[f] ? ++counter.dbks[f] : 1;
                }
            }
        }
        const result: TopNFlagsResponse = { pros: [], cons: [], dbks: [] };
        Object.entries(counter.dbks).map(([key, val]) => {
            result.dbks.push({ topic: key, cnt: val });
        });

        const filtered = Object.entries(counter.pros)
            .concat(Object.entries(counter.cons))
            .sort(([, aval], [, bval]) => bval - aval)
            .slice(0, n);

        for (const fc of filtered) {
            const [key, val] = fc;
            if (
                Object.values(ProFlagType)
                    .map((pro: string) => pro)
                    .includes(key)
            ) {
                result.pros.push({ topic: key, cnt: val });
            } else {
                result.cons.push({ topic: key, cnt: val });
            }
        }

        return result;
    }
}
