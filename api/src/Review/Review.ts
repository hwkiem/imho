import { ObjectType, Field, Root } from 'type-graphql';
import Container from 'typedi';
import { postgresHandler } from '../dataSources/postgres';
import { Flag } from '../Flag/Flag';
import { Residence } from '../Residence/Residence';
import { DateRange } from '../types/object_types';
import { User } from '../User/User';

@ObjectType()
export class Review {
    @Field()
    rev_id: number;

    user_id: number;

    res_id: number;

    // Residence
    @Field(() => Residence, { nullable: true })
    async residence(@Root() review: Review): Promise<Residence | undefined> {
        const pg = Container.get(postgresHandler);
        const residence = await pg.getSingleResidenceById(review.res_id);
        if (residence.errors || !residence.residence) return;

        return residence.residence;
    }
    // User
    @Field(() => User, { nullable: true })
    async user(@Root() review: Review): Promise<User | undefined> {
        const pg = Container.get(postgresHandler);
        const users = await pg.getUsersById([review.user_id]);
        if (users.errors || !users.users) return;

        return users.users[0];
    }

    // TODO Flags Resolver
    @Field(() => [Flag], { nullable: true })
    async flags(@Root() review: Review): Promise<Flag[] | undefined> {
        const pg = Container.get(postgresHandler);
        const flags = await pg.getFlagsByReviewId(review.rev_id);
        if (flags.errors || !flags.flags) return;
        return flags.flags;
    }

    @Field()
    rating?: number;

    @Field({ nullable: true })
    rent?: number;

    @Field(() => DateRange)
    lease_term: DateRange;

    @Field({ nullable: true })
    feedback?: string;

    @Field(() => String)
    created_at = new Date();

    @Field(() => String)
    updated_at = new Date();
}
