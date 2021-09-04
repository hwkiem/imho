import { Resolver, Mutation, Arg, Ctx, Query, Int } from 'type-graphql';
import { User } from './user';
import { validateRegister } from '../utils/validateRegister';
import argon2 from 'argon2';
import { UserResponse } from '../types/object_types';
import { MyContext } from '../types/types';
import {
    ChangePasswordInput,
    LoginInput,
    PartialUser,
    RegisterInput,
} from '../types/input_types';

declare module 'express-session' {
    interface Session {
        userId: number;
        // favoriteResidency
    }
}

@Resolver(User)
export class UserResolver {
    // Me Query
    @Query(() => UserResponse)
    async me(@Ctx() { req, dataSources }: MyContext): Promise<UserResponse> {
        const userId = req.session.userId;
        if (userId === undefined) {
            return { errors: [{ field: 'session', message: 'not logged in' }] };
        }
        const response = await dataSources.pgHandler.getUsersById([userId]);
        if (response.users && response.users.length == 0) {
            return {
                errors: [{ field: 'query', message: 'no user with this id' }],
            };
        }
        return response;
    }

    // Create User
    @Mutation(() => UserResponse)
    async register(
        @Arg('options') options: RegisterInput,
        @Ctx() { req, dataSources }: MyContext
    ): Promise<UserResponse> {
        const errors = validateRegister(options);
        if (errors) {
            return { errors };
        }
        const response = await dataSources.pgHandler.createUser(options);
        if (response.users) {
            req.session.userId = response.users[0].user_id;
        }
        return response;
    }

    // Logout User
    @Mutation(() => UserResponse)
    async logout(
        @Ctx() { dataSources, req, res }: MyContext
    ): Promise<UserResponse> {
        return new Promise(async (resolve) => {
            const userId = req.session.userId;
            if (userId === undefined) {
                resolve({
                    errors: [{ field: 'session', message: 'not logged in' }],
                });
            }
            const response = await dataSources.pgHandler.getUsersById([userId]);
            if (response.users) {
                req.session.destroy((err) => {
                    res.clearCookie('oreo');
                    if (err) {
                        console.log(err);
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
                    resolve({ users: response.users });
                });
            }
        });
    }

    // Login User
    @Mutation(() => UserResponse)
    async login(
        @Arg('input') input: LoginInput,
        @Ctx() { dataSources, req }: MyContext
    ): Promise<UserResponse> {
        const response = await dataSources.pgHandler.getUsersObject(
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
        return response;
    }

    // Change Password

    @Mutation(() => UserResponse)
    async changeMyPassword(
        @Arg('args') args: ChangePasswordInput,
        @Ctx() { dataSources, req }: MyContext
    ): Promise<UserResponse> {
        // ensure logged in
        const userId = req.session.userId;
        if (userId === undefined) {
            return { errors: [{ field: 'session', message: 'not logged in' }] };
        }
        const response = await dataSources.pgHandler.getUsersById([userId]);
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
        const res = await dataSources.pgHandler.changePassword(
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
    @Mutation(() => UserResponse)
    async deleteUser(
        @Arg('id') id: number,
        @Ctx() { dataSources }: MyContext
    ): Promise<UserResponse> {
        return await dataSources.pgHandler.deleteUser(id);
    }

    // Query Users
    @Query(() => UserResponse)
    async getUsersbyId(
        @Arg('user_ids', () => [Int]) ids: [number],
        @Ctx() { dataSources }: MyContext
    ): Promise<UserResponse> {
        return await dataSources.pgHandler.getUsersById(ids);
    }

    @Query(() => UserResponse) // return number of rows returned? everywhere?
    async getUsersObjFilter(
        @Arg('obj') obj: PartialUser,
        @Arg('limit', { nullable: true }) limit: number,
        @Ctx() { dataSources }: MyContext
    ): Promise<UserResponse> {
        return await dataSources.pgHandler.getUsersObject(obj, limit);
    }
}
