import { Arg, Ctx, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { MyContext } from '../utils/context';
import { ApiResponse } from '../utils/types/Response';
import { ImhoUser } from '../entities/ImhoUser';
import { LoginInput, RegisterInput } from '../validators/UserValidator';
import argon2 from 'argon2';
import { Service } from 'typedi';
import { OtpService } from '../services/OtpService';
import { EmailService } from '../services/EmailService';
import { SuccessResponse } from '../utils/types/Response';
import { v4 } from 'uuid';
import { ADMIN_SECRET, FORGET_PASSWORD_PREFIX } from '../utils/constants';
import { CreatePlaceInput } from '../validators/PlaceValidator';
import {
    createPendingUserIfNotExists,
    createPlaceIfNotExists,
} from '../utils/createIfNotExists';
import { UserRoles } from '../utils/enums/UserRoles';

declare module 'express-session' {
    interface Session {
        userId: string;
    }
}

@ObjectType()
export class UserResponse extends ApiResponse(ImhoUser) {}

@Resolver(() => ImhoUser)
@Service()
export class UserResolver {
    constructor(
        public otpService: OtpService,
        private readonly mailer: EmailService
    ) {}

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
        } catch {
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
                if (!user.reviewCollection.isInitialized())
                    user.reviewCollection.init();
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

    // hit this to track a place, creates pending account for first time email
    @Mutation(() => UserResponse)
    public async trackPlace(
        @Arg('placeInput') placeInput: CreatePlaceInput,
        @Arg('email', { nullable: true }) email: string,
        @Ctx() { em, req }: MyContext
    ): Promise<UserResponse> {
        // need either session or email for identity
        if (email === undefined && req.session.userId === undefined) {
            return {
                errors: [
                    {
                        field: 'email',
                        error: 'You are not logged in and we have no email for your updates!',
                    },
                ],
            };
        }

        // ensure place
        const placeResponse = await createPlaceIfNotExists(em, placeInput);
        if (placeResponse.errors || placeResponse.result === undefined)
            return { errors: placeResponse.errors };
        const place = placeResponse.result;

        // ensure user, from session if possible or if both provided
        const userResponse = await createPendingUserIfNotExists(
            em,
            req.session.userId
                ? { id: req.session.userId }
                : email
                ? { email: email }
                : {}
        );
        if (userResponse.errors || userResponse.result === undefined)
            return userResponse;
        const user = userResponse.result;

        // have dependencies, append user to place's notify array
        if (!place.notifyOnReview.isInitialized())
            await place.notifyOnReview.init();
        place.notifyOnReview.add(user);
        await em.persist(place).flush();
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
            if (user.isActivated === false || user.password === undefined)
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
        } catch {
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

    @Mutation(() => SuccessResponse)
    logout(@Ctx() { req, res }: MyContext): Promise<SuccessResponse> {
        return new Promise((resolve) =>
            req.session.destroy((err) => {
                res.clearCookie('oreo');
                if (err) {
                    resolve({
                        result: false,
                        errors: [
                            {
                                field: 'session',
                                error: 'could not destroy session',
                            },
                        ],
                    });
                    return;
                }
                resolve({ result: true });
            })
        );
    }

    // Ben changPassword and forgotPassword
    @Mutation(() => UserResponse)
    async changePassword(
        @Arg('token') token: string,
        @Arg('newPassword') newPassword: string,
        @Ctx() { redis, req, em }: MyContext
    ): Promise<UserResponse> {
        // if (newPassword.length <= 2) {
        //     return {
        //         errors: [
        //             {
        //                 field: 'newPassword',
        //                 error: 'length must be greater than 2',
        //             },
        //         ],
        //     };
        // }

        const key = FORGET_PASSWORD_PREFIX + token;
        const userId = await redis.get(key);
        if (userId === null) {
            return {
                errors: [
                    {
                        field: 'token',
                        error: 'token expired',
                    },
                ],
            };
        }

        const user = await em.findOne(ImhoUser, { id: userId });

        if (user === null) {
            return {
                errors: [
                    {
                        field: 'token',
                        error: 'user no longer exists',
                    },
                ],
            };
        }

        user.password = await argon2.hash(newPassword);
        em.persist(user).flush();

        await redis.del(key);

        // log in user after change password
        req.session.userId = user.id;

        return { result: user };
    }

    @Mutation(() => SuccessResponse)
    async forgotPassword(
        @Arg('email') email: string,
        @Ctx() { redis, em }: MyContext
    ): Promise<SuccessResponse> {
        const user = await em.findOne(ImhoUser, {
            email: email,
        });
        if (user === null) {
            // the email is not in the db
            return {
                result: false,
                errors: [
                    { field: 'email', error: 'no user exists with this email' },
                ],
            };
        }

        const token = v4();

        await redis.set(
            FORGET_PASSWORD_PREFIX + token,
            user.id,
            'ex',
            1000 * 60 * 60 * 24
        ); // 1 day

        await this.mailer.sendOtp(email, token);

        return { result: true };
    }

    @Mutation(() => SuccessResponse)
    async becomeAdmin(
        @Arg('adminSecret') secret: string,
        @Ctx() { req, em }: MyContext
    ): Promise<SuccessResponse> {
        if (req.session.userId) {
            return {
                errors: [{ field: 'session', error: 'already logged in' }],
            };
        }
        const user = await em.findOne(ImhoUser, {
            id: req.session.userId,
        });
        if (user === null) {
            return {
                result: false,
                errors: [
                    {
                        field: 'session',
                        error: 'no user exists with this your session id',
                    },
                ],
            };
        }

        if (secret !== ADMIN_SECRET)
            return {
                result: false,
                errors: [
                    {
                        field: 'secret',
                        error: 'invalid secret',
                    },
                ],
            };

        user.role = UserRoles.ADMIN;
        em.persist(user).flush();
        return { result: true };
    }
}
