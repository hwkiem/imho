import { postgresHandler } from '../dataSources/postgres';
import { User } from './User';
import argon2 from 'argon2';
import { UserResponse } from '../types/object_types';
import { RegisterInput } from '../types/input_types';
import { QueryOrderChoice, UserSortBy } from '../types/enum_types';

export async function getUsersById(
    this: postgresHandler,
    ids: [number]
): Promise<UserResponse> {
    let r: UserResponse = {};
    await this.knex<User>('users')
        .select('*')
        .where('user_id', 'in', ids)
        .then((users) => (r.users = users))
        .catch(
            (e) => (r.errors = [{ field: 'query user', message: e.toString() }])
        );
    return r;
}

export async function getUsersGeneric(
    this: postgresHandler,
    obj: Partial<User> = {},
    sort_params = {
        attribute: UserSortBy.ID,
        sort: QueryOrderChoice.ASC,
    },
    limit: number = 10
): Promise<UserResponse> {
    let r: UserResponse = {};
    await this.knex<User>('users')
        .select('*')
        .where(obj)
        .whereNotNull(sort_params.attribute)
        .orderBy(sort_params.attribute, sort_params.sort)
        .limit(limit)
        .then((users) => (r.users = users))
        .catch(
            (e) => (r.errors = [{ field: 'query user', message: e.toString() }])
        );
    return r;
}

export async function createUser(
    this: postgresHandler,
    input: RegisterInput
): Promise<UserResponse> {
    let r: UserResponse = {};
    input.password = await argon2.hash(input.password);
    await this.knex<User>('users')
        .insert(input)
        .returning('*')
        .then((users) => {
            r.users = users;
        })
        .catch((e) => {
            if (e.code === '23505') {
                r.errors = [{ message: 'email taken', field: 'email' }];
            } else {
                r.errors = [{ field: 'insert user', message: e.message }];
            }
        });
    return r;
}

export async function deleteUser(
    this: postgresHandler,
    id: number
): Promise<UserResponse> {
    let r: UserResponse = {};
    await this.knex<User>('users')
        .where('user_id', '=', id)
        .del()
        .returning('*')
        .then((user) => (r.users = user))
        .catch(
            (e) =>
                (r.errors = [{ field: 'delete user', message: e.toString() }])
        );
    return r;
}

export async function changePassword(
    this: postgresHandler,
    new_password: string,
    user_id: number
): Promise<UserResponse> {
    let r: UserResponse = {};

    await this.knex<User>('users')
        .where('user_id', '=', user_id)
        .update({ password: new_password })
        .returning('*')
        .then((users) => (r.users = users))
        .catch(
            (e) =>
                (r.errors = [{ field: 'update user', message: e.toString() }])
        );
    return r;
}
