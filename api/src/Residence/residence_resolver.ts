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
        const loc = await dataSources.pgHandler.getLocationsGeneric({
            google_place_id: options.google_place_id,
        });
        if (loc.errors !== undefined || loc.locations === undefined) {
            return { errors: loc.errors };
        }
        // Location does not exist, create
        if (loc.locations && loc.locations.length == 0) {
            const geocode =
                await dataSources.googleMapsHandler.locationFromPlaceID(
                    options.google_place_id
                );
            const { unit, ...rest } = options;
            if (geocode instanceof FieldError) return { errors: [geocode] };
            const response = await dataSources.pgHandler.createLocation(
                geocode,
                rest
            );
            if (response.errors) return { errors: response.errors };
            if (!response.location)
                return {
                    errors: [
                        {
                            field: 'create location',
                            message:
                                'unable to make location for this residence',
                        },
                    ],
                };
            // add loc_id to input
            options.loc_id = response.location.loc_id;
        } else {
            // loc already exists, add its loc_id
            options.loc_id = loc.locations[0].loc_id;
        }

        const response = await dataSources.pgHandler.createResidence(options);
        return response;
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
