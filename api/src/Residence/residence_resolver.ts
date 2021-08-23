import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { ResidenceGQL } from './residence';
import { MyContext } from '../types';
import { CreateResidenceInput, ResidenceResponse } from '../types';

@Resolver(ResidenceGQL)
export class ResidencyResolver {
  @Mutation(() => ResidenceResponse)
  async createResidency(
    @Arg('options') options: CreateResidenceInput,
    @Ctx() { dataSources }: MyContext
  ): Promise<ResidenceResponse> {
    const response = await dataSources.pgHandler.createResidence(
      options,
      dataSources.googleMapsHandler.locationFromPlaceID
    );
    return response;
  }

  @Query(() => ResidenceResponse)
  async getResidencesById(
    @Arg('res_ids', () => [Int]) ids: [number],
    @Ctx() { dataSources }: MyContext
  ): Promise<ResidenceResponse> {
    return await dataSources.pgHandler.getResidencesById(ids);
  }

  @Query(() => ResidenceResponse)
  async getResidencesLimit(
    @Arg('limit', () => Int) limit: number,
    @Ctx() { dataSources }: MyContext
  ): Promise<ResidenceResponse> {
    return await dataSources.pgHandler.getResidencesLimit(limit);
  }

  // get by placeID
  @Query(() => ResidenceResponse)
  async getResidencesByPlaceId(
    @Arg('place_id', () => String) place_id: string,
    @Ctx() { dataSources }: MyContext
  ): Promise<ResidenceResponse> {
    return await dataSources.pgHandler.getResidencesObject({
      google_place_id: place_id,
    });
  }
}
