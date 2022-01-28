import { Arg, Ctx, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { MyContext } from '../utils/context';
import { ApiResponse } from '../utils/types/Response';
import { ImhoUser } from '../entities/ImhoUser';
import {
    LoginInput,
    PendingUserInput,
    RegisterInput,
    TrackPlaceInput,
} from '../validators/UserValidator';
import argon2 from 'argon2';
import { Place } from '../entities/Place';
// import { authenticator } from 'otplib';

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
        @Arg('input') input: RegisterInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        // is there a pending user with this email, create if not
        try {
            const user = await em.findOneOrFail(ImhoUser, {
                email: input.email,
            });
            if (user.isActivated === true) {
                return {
                    errors: [
                        {
                            field: 'email',
                            error: 'an activated account with that email already exists',
                        },
                    ],
                };
            } else {
                user.password = await argon2.hash(input.password);
                user.isActivated = true;
                req.session.userId = user.id;
                em.persist(user).flush();
                return { result: user };
            }
        } catch (e) {
            // inactive account does not exist, create from scratch
            const user = new ImhoUser(input);
            user.password = await argon2.hash(input.password);
            user.isActivated = true;
            req.session.userId = user.id;
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
            return {
                      errors: [
                          {
                              field: 'user',
                              error: `${user.isActivated ? 'activated' : 'pending'} account already exists with this email`,
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

    // hit this to track a place, creates pending account first time
    @Mutation(() => UserResponse)
    public async trackPlace(
        @Arg('input') input: TrackPlaceInput,
        @Ctx() { em, req, res }: MyContext
    ): Promise<UserResponse> {
        // ensure place
        let place: Place;
        try {
            place = await em.findOneOrFail(Place, {
                google_place_id: input.placeInput.google_place_id,
            });
        } catch {
            place = new Place(input.placeInput);
        }

        // ensure user, from session if possible
        let user: ImhoUser;
        try {
            user = req.session.userId
                ? await em.findOneOrFail(ImhoUser, {
                      id: req.session.userId,
                  })
                : await em.findOneOrFail(ImhoUser, {
                      email: input.userInput.email,
                  });
        } catch {
            // place, no user
            const userResponse = await this.createPendingUser(input.userInput, {
                em,
                req,
                res,
            });
            if (userResponse.errors || userResponse.result === undefined)
                return userResponse;
            user = userResponse.result;
        }

        if (!place.notifyOnReview.isInitialized())
            await place.notifyOnReview.init();
        place.notifyOnReview.add(user);
        await em.persist(user).persist(place).flush();
        return { result: user };
    }

    // login
    @Mutation(() => UserResponse)
    public async login(
        @Arg('input') input: LoginInput,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        if (req.session.userId) {
            return {
                errors: [{ field: 'session', error: 'already logged in' }],
            };
        }
        try {
            const user = await em.findOneOrFail(ImhoUser, {
                email: input.email,
            });
            if (user.isActivated === false)
                return {
                    errors: [
                        {
                            field: 'account',
                            error: 'Account with this email is pending / not yet activated',
                        },
                    ],
                };
            if (!(await argon2.verify(user.password, input.password))) {
                return {
                    errors: [
                        {
                            field: 'password',
                            error: 'incorrect password',
                        },
                    ],
                };
            }
            // user exists, is activated, and is authenticated
            req.session.userId = user.id;
            return { result: user };
        } catch (e) {
            return {
                errors: [
                    {
                        field: 'email',
                        error: 'user with this email does not exist',
                    },
                ],
            };
        }
    }

    @Mutation(() => Boolean)
    logout(@Ctx() { req, res }: MyContext) {
        return new Promise((resolve) =>
            req.session.destroy((err) => {
                res.clearCookie('oreo');
                if (err) {
                    resolve(false);
                    return;
                }
                resolve(true);
            })
        );
    }

    // forgot password
}
