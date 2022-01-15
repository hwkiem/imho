import { ObjectType, Field, Root } from 'type-graphql';
import Container from 'typedi';
import { postgresHandler } from '../dataSources/postgres';
import { Residence } from '../Residence/Residence';
import { FlagsType } from '../types/flags';

import { User } from '../User/User';

@ObjectType()
export class Review {
    @Field()
    rev_id: number;

    user_id?: number | undefined;

    res_id: number;

    @Field(() => FlagsType)
    flags: FlagsType;

    @Field()
    rating: number;

    @Field({ nullable: true })
    feedback?: string;

    // Residence this review is about
    @Field(() => Residence, { nullable: true })
    async residence(@Root() review: Review): Promise<Residence | undefined> {
        const pg = Container.get(postgresHandler);
        const residence = await pg.getSingleResidenceById(review.res_id);
        if (residence.errors || !residence.residence) return;

        return residence.residence;
    }
    // User who wrote this review
    @Field(() => User, { nullable: true })
    async author(@Root() review: Review): Promise<User | undefined> {
        if (!review.user_id) return; // could be anomymous
        const pg = Container.get(postgresHandler);
        const users = await pg.getUsersById([review.user_id]);
        if (users.errors || !users.users) return;
        return users.users[0];
    }

    @Field(() => String)
    created_at = new Date();

    @Field(() => String)
    updated_at = new Date();
}
