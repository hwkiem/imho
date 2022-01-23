import { Arg, Ctx, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { MyContext } from '../utils/context';
import { ApiResponse } from '../utils/types/Response';
import { ImhoUser } from '../entities/ImhoUser';
import { PendingUserInput, UserValidator } from '../validators/UserValidator';
import argon2 from 'argon2';

declare module 'express-session' {
    interface Session {
        userId: string;
    }
}

@ObjectType()
class UserResponse extends ApiResponse(ImhoUser) {}

@Resolver(() => ImhoUser)
export class UserResolver {
    @Query(() => UserResponse)
    public async getUser(
        @Ctx() { em }: MyContext,
        @Arg('userId') userId: string
    ): Promise<UserResponse> {
        try {
            const user = await em.findOneOrFail(ImhoUser, {
                id: userId,
            });
            return { result: user };
        } catch (e) {
            console.log(e);
            return {
                errors: [
                    {
                        field: 'userId',
                        error: 'Could not find matching user.',
                    },
                ],
            };
        }
    }

    @Query(() => UserResponse)
    public async me(@Ctx() { em, req }: MyContext): Promise<UserResponse> {
        if (!req.session.userId) {
            return { errors: [{ field: 'session', error: 'not logged in' }] };
        }
        try {
            const user = await em.findOneOrFail(ImhoUser, {
                id: req.session.userId,
            });
            return { result: user };
        } catch (e) {
            console.log(e);
            return {
                errors: [
                    {
                        field: 'userId',
                        error: 'Could not find matching user.',
                    },
                ],
            };
        }
    }

    @Mutation(() => UserResponse)
    public async registerUser(
        @Arg('input') input: UserValidator,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        // is there a pending user with this email, create if not
        try {
            const user = await em.findOneOrFail(ImhoUser, {
                email: input.email,
            });
            if (user.isActivated) {
                return {
                    errors: [
                        {
                            field: 'user status',
                            error: 'user is already registered with activated account',
                        },
                    ],
                };
            } else {
                user.password = await argon2.hash(input.password);
                user.isActivated = true;
                if (!user.reviewCollection.isInitialized())
                    user.reviewCollection.init();
                req.session.userId = user.id;
                em.persist(user).flush();
                return { result: user };
            }
        } catch (e) {
            // inactive account does not exist, create from scratch
            const user = new ImhoUser(input);
            req.session.userId = user.id;
            user.isActivated = true;
            em.persist(user).flush();
            return { result: user };
        }
    }

    @Mutation(() => UserResponse)
    public async createPendingUser(
        @Arg('input') input: PendingUserInput,
        @Ctx() { em }: MyContext
    ): Promise<UserResponse> {
        // is there a pending user with this email, create if not
        try {
            const user = await em.findOneOrFail(ImhoUser, {
                email: input.email,
            });
            return user.isActivated
                ? {
                      errors: [
                          {
                              field: 'user status',
                              error: 'user is already registered with activated account',
                          },
                      ],
                  }
                : {
                      errors: [
                          {
                              field: 'user status',
                              error: 'pending account already exists with this email',
                          },
                      ],
                  };
        } catch (e) {
            // no user with this email, create inactive account
            const user = new ImhoUser(input);
            user.isActivated = false;
            em.persist(user).flush();
            return { result: user };
        }
    }

    // login

    // logout

    // forgot password
}
