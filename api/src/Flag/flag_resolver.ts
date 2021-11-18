import { Arg, Int, Mutation, Query, Resolver } from 'type-graphql';
import { Service } from 'typedi';
import { postgresHandler } from '../dataSources/postgres';
import { FlagInput } from '../types/input_types';
import { FieldError, FlagResponse } from '../types/object_types';
import { validateFlagInput } from '../utils/validators';
import { Flag } from './Flag';

@Service()
@Resolver(Flag)
export class FlagResolver {
    constructor(private readonly pg: postgresHandler) {}
    @Mutation(() => FlagResponse)
    async createFlag(
        @Arg('options') input: FlagInput,
        @Arg('rev_id', () => Int) rev_id: number
    ): Promise<FlagResponse> {
        const processedFlag = validateFlagInput(input);
        if (processedFlag instanceof FieldError)
            return { errors: [processedFlag] };
        return await this.pg.createFlag(
            rev_id,
            processedFlag.category,
            processedFlag.topic
        );
    }

    // get by batch of ids
    @Query(() => FlagResponse)
    async getFlagsById(
        @Arg('flag_ids', () => [Int]) ids: [number]
    ): Promise<FlagResponse> {
        return await this.pg.getFlagsById(ids);
    }
}
