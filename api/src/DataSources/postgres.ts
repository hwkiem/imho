import { SQLDataSource } from 'datasource-sql';
import { RegisterInput, UserResponse } from '../types';
import argon2 from 'argon2';
import { UserGQL } from '../User/user';

export class postgresHandler extends SQLDataSource {
  async getUsersById(ids: [number]): Promise<UserResponse> {
    let r: UserResponse = {};
    await this.knex<UserGQL>('users')
      .select('*')
      .where('user_id', 'in', ids) // in
      .then((users) => (r.users = users))
      .catch(
        (e) => (r.errors = [{ field: 'query user', message: e.toString() }])
      );
    return r;
  }

  async getUsers(limit: number): Promise<UserResponse> {
    let r: UserResponse = {};
    await this.knex<UserGQL>('users')
      .select('*')
      .limit(limit)
      .then((users) => (r.users = users))
      .catch(
        (e) => (r.errors = [{ field: 'query user', message: e.toString() }])
      );
    return r;
  }

  async createUser(input: RegisterInput): Promise<UserResponse> {
    let r: UserResponse = {};
    input.password = await argon2.hash(input.password);
    const args = {
      ...input,
      created_at: this.knex.fn.now(),
      updated_at: this.knex.fn.now(),
    };
    await this.knex<UserGQL>('users')
      .insert(args)
      .returning('*')
      .then((users) => (r.users = users))
      .catch(
        (e) => (r.errors = [{ field: 'insert user', message: e.toString() }])
      );
    return r;
  }

  async deleteUser(id: number): Promise<UserResponse> {
    let r: UserResponse = {};
    await this.knex<UserGQL>('users')
      .where('user_id', '=', id)
      .del()
      .returning('*')
      .then((user) => (r.users = user))
      .catch(
        (e) => (r.errors = [{ field: 'delete user', message: e.toString() }])
      );
    return r;
  }
}
