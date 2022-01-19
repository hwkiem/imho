import { Place } from '../entities/Place';
import {
    Arg,
    Ctx,
    Field,
    FieldResolver,
    ObjectType,
    Query,
    Resolver,
    Root,
} from 'type-graphql';
import { MyContext } from '../utils/context';
import { ApiResponse } from '../utils/types/Response';
import { Flags } from '../utils/types/Flag';
import {
    ConFlagType,
    DbkFlagType,
    ProFlagType,
} from '../utils/enums/FlagType.enum';

@ObjectType()
class PlaceResponse extends ApiResponse(Place) {}

@ObjectType()
class FlagWithCount {
    @Field()
    topic: string;
    @Field()
    cnt: number;
}

@ObjectType()
class TopNFlagsResponse {
    @Field(() => [FlagWithCount])
    pros: FlagWithCount[];
    @Field(() => [FlagWithCount])
    cons: FlagWithCount[];
    @Field(() => [FlagWithCount])
    dbks: FlagWithCount[];
}

@Resolver(() => Place)
export class PlaceResolver {
    @Query(() => PlaceResponse)
    public async getPlace(
        @Ctx() ctx: MyContext,
        @Arg('placeId') placeId: string
    ): Promise<PlaceResponse> {
        try {
            const place = await ctx.em.findOneOrFail(
                Place,
                {
                    google_place_id: placeId,
                },
                ['residences', 'residences.reviews']
            );
            return { result: place };
        } catch (e) {
            console.log(e);
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
        for (const residence of place.residences) {
            for (const review of residence.reviews) {
                const flags: Flags = JSON.parse(review.flag_string);
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
