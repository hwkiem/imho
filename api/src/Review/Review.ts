import { ObjectType, Field, Root } from 'type-graphql';
import Container from 'typedi';
import { postgresHandler } from '../dataSources/postgres';
import { Residence } from '../Residence/Residence';
import { GreenFlags, RedFlags } from '../types/enum_types';
import { DateRange, FieldError } from '../types/object_types';
import { User } from '../User/User';

@ObjectType()
export class Review {
    @Field()
    rev_id: number;

    // @Field(() => [GreenFlags])
    // green_flags: GreenFlags[];

    // @Field(() => [RedFlags])
    // red_flags: RedFlags[];

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
    async author(@Root() review: Review): Promise<User | undefined> {
        const pg = Container.get(postgresHandler);
        const users = await pg.getUsersById([review.user_id]);
        if (users.errors || !users.users) return;

        return users.users[0];
    }
    // Flags
    @Field(() => [RedFlags], { nullable: true })
    async red_flags(@Root() review: Review): Promise<RedFlags[] | undefined> {
        const pg = Container.get(postgresHandler);
        const flags = await pg.getReviewFlagsByType(review.rev_id, 'RED');
        if (flags instanceof FieldError) return;
        return flags;
    }

    @Field(() => [GreenFlags], { nullable: true })
    async green_flags(
        @Root() review: Review
    ): Promise<GreenFlags[] | undefined> {
        const pg = Container.get(postgresHandler);
        const flags = await pg.getReviewFlagsByType(review.rev_id, 'GREEN');
        if (flags instanceof FieldError) return;
        return flags;
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
