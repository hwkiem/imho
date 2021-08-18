import { Resolver, Mutation, Arg, Ctx, Query, Int } from 'type-graphql';
import { UserGQL } from './user';
import { validateRegister } from '../utils/validateRegister';
import { UserResponse, RegisterInput, MyContext, LoginInput } from '../types';
import argon2 from 'argon2';

declare module 'express-session' {
  interface Session {
    userId: number;
    // favoriteResidency
  }
}

@Resolver(UserGQL)
export class UserResolver {
  // Me Query
  @Query(() => UserResponse)
  async me(@Ctx() { req, dataSources }: MyContext): Promise<UserResponse> {
    const userId = req.session.userId;
    if (!userId) {
      return { errors: [{ field: 'session', message: 'not logged in' }] };
    }
    const response = await dataSources.pgHandler.getUsersById([userId]);
    if (response.users && response.users.length == 0) {
      return { errors: [{ field: 'query', message: 'no user with this id' }] };
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
  async logout(@Ctx() { dataSources, req }: MyContext): Promise<UserResponse> {
    const userId = req.session.userId;
    if (!userId) {
      return { errors: [{ field: 'session', message: 'not logged in' }] };
    }
    const response = await dataSources.pgHandler.getUsersById([userId]);
    if (response.users) {
      req.session.destroy((err) => console.log(err));
    }
    return response;
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
    // console.log(response);
    if (response.users) {
      if (!(await argon2.verify(response.users[0].password, input.password))) {
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

  // Query Users
  @Query(() => UserResponse)
  async getUsers(
    @Arg('limit', () => Int) limit: number,
    @Ctx() { dataSources }: MyContext
  ): Promise<UserResponse> {
    return await dataSources.pgHandler.getUsersLimit(limit);
  }

  // // changes signed in user's password, to test updated_at
  // @Mutation(() => UserResponse)
  // async changePassword(
  //   @Ctx() { pool, req }: MyContext,
  //   @Arg("newPass") newPass: string
  // ): Promise<UserResponse> {
  //   if (!req.session!.userId) {
  //     return {
  //       errors: [{ message: "session", field: "not logged in" }],
  //     };
  //   }
  //   const hashedPass = await argon2.hash(newPass);
  //   const dbRes = await pool.query(
  //     "UPDATE users SET password=$1 WHERE user_id = $2 RETURNING *",
  //     [hashedPass, req.session.userId]
  //   );
  //   if (dbRes.rowCount == 0) {
  //     return {
  //       errors: [{ message: "update", field: "could not update password" }],
  //     };
  //   }

  //   return { user: rowsToUsers(dbRes)[0] };
  // }

  // Update User ; new email? name?
}
