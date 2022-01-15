import { Arg, Int, Query, Resolver } from 'type-graphql';
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
import { Service } from 'typedi';
import { postgresHandler } from '../dataSources/postgres';
import { LocationCategory } from '../types/enum_types';
@Service()
@Resolver(Residence)
export class ResidencyResolver {
    constructor(private readonly pg: postgresHandler) {}
    // @Mutation(() => SingleResidenceResponse)
    async createResidence(
        @Arg('options') options: CreateResidenceInput
    ): Promise<SingleResidenceResponse> {
        // ensure location exists
        // its gonna exist ... right?
        const loc_id = await this.pg.createLocationIfNotExists(
            options.google_place_id,
            LocationCategory.HOUSE,
            '' // no landlord
        );
        if (loc_id instanceof FieldError) return { errors: [loc_id] };

        return await this.pg.createResidence(loc_id, options.unit);
    }

    // get by batch of ids
    @Query(() => ResidenceResponse)
    async getResidencesById(
        @Arg('res_ids', () => [Int]) ids: [number]
    ): Promise<ResidenceResponse> {
        return await this.pg.getResidencesById(ids);
    }

    // location agnostic
    @Query(() => ResidenceResponse)
    async getResidencesGeneric(
        @Arg('options', { nullable: true }) options: ResidenceQueryOptions
    ): Promise<ResidenceResponse> {
        return options
            ? await this.pg.getResidencesGeneric(
                  options.partial_residence
                      ? options.partial_residence
                      : undefined,
                  options.sort_params ? options.sort_params : undefined,
                  options.limit ? options.limit : undefined
              )
            : await this.pg.getResidencesGeneric();
    }
}
