import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Residence } from './Residence';
import {
    FieldError,
    ResidenceResponse,
    SingleResidenceResponse,
} from '../types/object_types';
import {
    CreateResidenceInput,
    ResidenceQueryOptions,
} from '../types/input_types';
import { MyContext } from '../types/types';

@Resolver(Residence)
export class ResidencyResolver {
    @Mutation(() => SingleResidenceResponse)
    async createResidence(
        @Arg('options') options: CreateResidenceInput,
        @Ctx() { dataSources }: MyContext
    ): Promise<SingleResidenceResponse> {
        // ensure location exists
        const loc_id = await dataSources.pgHandler.createLocationIfNotExists(
            options.google_place_id,
            dataSources.googleMapsHandler.locationFromPlaceID
        );
        if (loc_id instanceof FieldError) return { errors: [loc_id] };

        return await dataSources.pgHandler.createResidence(
            loc_id,
            options.unit
        );
    }

    // get by batch of ids
    @Query(() => ResidenceResponse)
    async getResidencesById(
        @Arg('res_ids', () => [Int]) ids: [number],
        @Ctx() { dataSources }: MyContext
    ): Promise<ResidenceResponse> {
        return await dataSources.pgHandler.getResidencesById(ids);
    }

    // location agnostic
    @Query(() => ResidenceResponse)
    async getResidencesGeneric(
        @Arg('options', { nullable: true }) options: ResidenceQueryOptions,
        @Ctx() { dataSources }: MyContext
    ): Promise<ResidenceResponse> {
        // need awaits here?
        return options
            ? await dataSources.pgHandler.getResidencesGeneric(
                  options.partial_residence
                      ? options.partial_residence
                      : undefined,
                  options.sort_params ? options.sort_params : undefined,
                  options.limit ? options.limit : undefined
              )
            : await dataSources.pgHandler.getResidencesGeneric();
    }
}
