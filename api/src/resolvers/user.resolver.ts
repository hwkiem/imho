import { Arg, Ctx, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import { MyContext } from '../utils/context';
import { ApiResponse } from '../utils/types/Response';
import { ImhoUser } from '../entities/ImhoUser';
import {
    ChangePasswordInput,
    LoginInput,
    PendingUserInput,
    RegisterInput,
    ResetPasswordInput,
    TrackPlaceInput,
} from '../validators/UserValidator';
import argon2 from 'argon2';
import { Place } from '../entities/Place';
import { authenticator } from 'otplib';
import { Service } from 'typedi';
import { Otp, OtpService } from '../services/OtpService';
import { EmailService } from '../services/EmailService';
import { SuccessResponse } from '../utils/types/SuccessResonse';
import { OtpValidator } from '../validators/OtpValidator';

declare module 'express-session' {
    interface Session {
        userId: string;
    }
}

@ObjectType()
class UserResponse extends ApiResponse(ImhoUser) {}

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
                              field: 'user',
                              error: 'activated account already exists with this email',
                          },
                      ],
                  }
                : {
                      errors: [
                          {
                              field: 'user',
                              error: 'pending account already exists with this email',
                          },
                      ],
                  };
        } catch {
            // no user with this email, create inactive account
            const user = new ImhoUser(input);
            user.isActivated = false;
            em.persist(user).flush();
            return { result: user };
        }
    }

    // hit this to track a place, creates pending account for first time email
    @Mutation(() => UserResponse)
    public async trackPlace(
        @Arg('input') input: TrackPlaceInput,
        @Ctx() { em, req, res }: MyContext
    ): Promise<UserResponse> {
        //
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
                        success: false,
                        apiError: {
                            field: 'session',
                            error: 'could not destroy session',
                        },
                    });
                    return;
                }
                resolve({ success: true });
            })
        );
    }

    // forgot password
    @Mutation(() => SuccessResponse)
    async forgotPassword(
        @Ctx() { em }: MyContext,
        @Arg('input') input: PendingUserInput
    ): Promise<SuccessResponse> {
        // ensure user
        let user: ImhoUser;
        try {
            user = await em.findOneOrFail(ImhoUser, {
                email: input.email,
            });
        } catch {
            return {
                success: false,
                apiError: { field: 'email', error: 'no user with that email' },
            };
        }
        // ensure active account with password to forget
        if (!user.isActivated) return { success: false };
        // ensure env
        if (!process.env.OTP_SECRET)
            return {
                success: false,
                apiError: {
                    field: 'email',
                    error: 'this account is not yet activated',
                },
            };

        // create OTP object and write to redis
        const secret = process.env.OTP_SECRET + user.id.replaceAll('-', '');
        // console.log(secret);
        const token = authenticator.generate(secret); // unique but secret
        // console.log(token);
        const otp = new Otp(token);
        const stored = await this.otpService.storeOtp(otp);

        if (!stored)
            return {
                success: false,
                apiError: { field: 'OTP', error: 'failed to store' },
            };
        // email
        const mailed = this.mailer.sendOtp(input.email, otp.otp);
        if (!mailed)
            return {
                success: false,
                apiError: {
                    field: 'email',
                    error: 'could not send email to' + input.email,
                },
            };
        return { success: true };
    }

    @Mutation(() => UserResponse)
    async verify_OTP(
        @Ctx() { em, req }: MyContext,
        @Arg('input') input: OtpValidator
    ): Promise<UserResponse> {
        // fetch user for id
        let user: ImhoUser;
        try {
            user = await em.findOneOrFail(ImhoUser, {
                email: input.email,
            });
        } catch {
            return {
                errors: [{ field: 'email', error: 'no user with that email' }],
            };
        }
        // is this otp valid?
        const authenticated = await this.otpService.validateOtp(input, user.id);
        if (
            authenticated.success === false &&
            authenticated.apiError !== undefined
        )
            return {
                errors: [authenticated.apiError],
            };
        // user is authenticated by OTP, add session
        req.session.userId = user.id;
        return { result: user };
    }

    // post OTP, overwrite old forgotten password
    @Mutation(() => SuccessResponse)
    async resetPassword(
        @Ctx() { em, req }: MyContext,
        @Arg('input') input: ResetPasswordInput
    ): Promise<SuccessResponse> {
        if (!req.session.userId) {
            return {
                success: false,
                apiError: { field: 'session', error: 'not logged in' },
            };
        }

        let user: ImhoUser;
        try {
            user = await em.findOneOrFail(ImhoUser, {
                id: req.session.userId,
            });
        } catch {
            return {
                success: false,
                apiError: {
                    field: 'session',
                    error: 'failed to fetch user from session',
                },
            };
        }
        // don't need to check activated ..

        // change their password and persist
        user.password = await argon2.hash(input.password);
        em.persist(user).flush();
        return { success: true };
    }

    // logged in user enters old password to validate and their desired new password
    @Mutation(() => SuccessResponse)
    async changePassword(
        @Ctx() { em, req }: MyContext,
        @Arg('input') input: ChangePasswordInput
    ): Promise<SuccessResponse> {
        if (!req.session.userId) {
            return {
                success: false,
                apiError: { field: 'session', error: 'not logged in' },
            };
        }

        let user: ImhoUser;
        try {
            user = await em.findOneOrFail(ImhoUser, {
                id: req.session.userId,
            });
        } catch {
            return {
                success: false,
                apiError: {
                    field: 'session',
                    error: 'failed to fetch user from session',
                },
            };
        }
        // if on session, should be activated; meant to type guard user.password
        if (user.isActivated === false || user.password === undefined)
            return {
                success: false,
                apiError: {
                    field: 'account',
                    error: 'Account with this email is pending / not yet activated',
                },
            };

        // is their old password accurate
        if (!(await argon2.verify(user.password, input.old_password))) {
            return {
                success: false,
                apiError: {
                    field: 'password',
                    error: 'incorrect password',
                },
            };
        }

        // change their password and persist
        user.password = await argon2.hash(input.new_password);
        em.persist(user).flush();
        return { success: true };
    }
}
