import { Resolver, Mutation, Arg, Ctx, Query, Int } from 'type-graphql';
import { User } from './User';
import { validateRegister } from '../utils/validators';
import argon2 from 'argon2';
import { SingleUserResponse, UserResponse } from '../types/object_types';
import { MyContext } from '../types/types';
import {
    ChangePasswordInput,
    LoginInput,
    RegisterInput,
    UserQueryOptions,
} from '../types/input_types';
import { Service } from 'typedi';
import { postgresHandler } from '../dataSources/postgres';

declare module 'express-session' {
    interface Session {
        userId: number;
        // favoriteResidency
    }
}
@Service()
@Resolver(User)
export class UserResolver {
    constructor(private readonly pg: postgresHandler) {}
    // Me Query
    @Query(() => SingleUserResponse)
    async me(@Ctx() { req }: MyContext): Promise<SingleUserResponse> {
        const userId = req.session.userId;
        if (userId === undefined) {
            return { errors: [{ field: 'session', message: 'not logged in' }] };
        }
        const response = await this.pg.getUsersById([userId]);
        if (response.users && response.users.length == 0) {
            return {
                errors: [{ field: 'query', message: 'no user with this id' }],
            };
        }
        return {
            errors: response.errors,
            user: response.users ? response.users[0] : undefined,
        };
    }

    // Create User
    @Mutation(() => SingleUserResponse)
    async register(
        @Arg('options') options: RegisterInput,
        @Ctx() { req }: MyContext
    ): Promise<SingleUserResponse> {
        const errors = validateRegister(options);
        if (errors) {
            return { errors };
        }
        const response = await this.pg.createUser(options);
        if (response.users) {
            req.session.userId = response.users[0].user_id;
        }
        return {
            errors: response.errors,
            user: response.users ? response.users[0] : undefined,
        };
    }

    // Logout User
    @Mutation(() => SingleUserResponse)
    async logout(@Ctx() { req, res }: MyContext): Promise<SingleUserResponse> {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve) => {
            const userId = req.session.userId;
            if (userId === undefined) {
                resolve({
                    errors: [{ field: 'session', message: 'not logged in' }],
                });
            }
            const response = await this.pg.getUsersById([userId]);
            if (response.users) {
                req.session.destroy((err) => {
                    res.clearCookie('oreo');
                    if (err) {
                        resolve({
                            errors: [
                                {
                                    field: 'session',
                                    message: 'unable to destroy session.',
                                },
                            ],
                        });
                        return;
                    }
                    resolve({
                        errors: response.errors,
                        user: response.users ? response.users[0] : undefined,
                    });
                });
            }
        });
    }

    // Login User
    @Mutation(() => SingleUserResponse)
    async login(
        @Arg('input') input: LoginInput,
        @Ctx() { req }: MyContext
    ): Promise<SingleUserResponse> {
        const response = await this.pg.getUsersGeneric(
            (({ email }) => ({ email }))(input)
        );
        if (response.users) {
            if (response.users.length == 0) {
                return {
                    errors: [
                        {
                            field: 'email',
                            message: 'no account with this email',
                        },
                    ],
                };
            }
            if (
                !(await argon2.verify(
                    response.users[0].password,
                    input.password
                ))
            ) {
                return {
                    errors: [
                        {
                            field: 'password',
                            message: 'wrong password',
                        },
                    ],
                };
            }
            req.session.userId = response.users[0].user_id;
        }
        return {
            errors: response.errors,
            user: response.users ? response.users[0] : undefined,
        };
    }

    // Change Password

    @Mutation(() => UserResponse)
    async changeMyPassword(
        @Arg('args') args: ChangePasswordInput,
        @Ctx() { req }: MyContext
    ): Promise<UserResponse> {
        // ensure logged in
        const userId = req.session.userId;
        if (userId === undefined) {
            return { errors: [{ field: 'session', message: 'not logged in' }] };
        }
        const response = await this.pg.getUsersById([userId]);
        // type guards, ensure users
        if (response.errors !== undefined || response.users === undefined) {
            return {
                errors: [
                    { field: 'fetch user', message: 'user does not exist' },
                ],
            };
        }

        // check password correct
        if (
            !(await argon2.verify(
                // force bc checked above
                response.users[0].password,
                args.old_password
            ))
        ) {
            return {
                errors: [
                    {
                        field: 'password',
                        message: 'wrong password',
                    },
                ],
            };
        }
        const newPass = await argon2.hash(args.new_password);
        const res = await this.pg.changePassword(
            newPass,
            response.users[0].user_id
        );
        if (res.errors !== undefined || res.users === undefined) {
            return {
                errors: [
                    {
                        field: 'update user',
                        message: 'failed to change password',
                    },
                ],
            };
        }
        response.users[0].password = newPass;
        return response;
    }

    // Delete User
    @Mutation(() => SingleUserResponse)
    async deleteUser(@Arg('id') id: number): Promise<SingleUserResponse> {
        const response = await this.pg.deleteUser(id);
        return {
            errors: response.errors,
            user: response.users ? response.users[0] : undefined,
        };
    }

    // Query Users
    @Query(() => UserResponse)
    async getUsersbyId(
        @Arg('user_ids', () => [Int]) ids: [number]
    ): Promise<UserResponse> {
        return await this.pg.getUsersById(ids);
    }

    @Query(() => UserResponse) // return number of rows returned? everywhere?
    async getUsersGeneric(
        @Arg('options', { nullable: true }) options: UserQueryOptions
    ): Promise<UserResponse> {
        return options
            ? await this.pg.getUsersGeneric(
                  options.partial_user ? options.partial_user : undefined,
                  options.sort_params ? options.sort_params : undefined,
                  options.limit ? options.limit : undefined
              )
            : await this.pg.getUsersGeneric();
    }
}
