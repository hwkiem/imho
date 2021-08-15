import { Resolver, Mutation, Arg, Ctx, Query } from "type-graphql";
import { MyContext } from "../types";
import { UserGQL } from "./user";
import { validateRegister } from "../utils/validateRegister";
import { UserResponse, RegisterInput } from "../types";
import argon2 from "argon2";
import { rowsToUsers } from "../utils/queryUtils";

declare module "express-session" {
  interface Session {
    userId: number;
    // favoriteResidency
  }
}

@Resolver(UserGQL)
export class UserResolver {
  // Me Query
  @Query(() => UserResponse)
  async me(@Ctx() { req, pool }: MyContext) {
    const userId = req.session.userId;
    if (!userId) {
      return { errors: [{ field: "login", message: "not logged in" }] };
    }
    const pg = await pool.connect();
    const dbRes = await pg.query("SELECT * FROM users WHERE user_id = $1", [
      userId,
    ]);
    pg.release();
    if (dbRes.rowCount == 0) {
      return {
        errors: [{ field: "account", message: "no User with your id" }],
      };
    }
    return { user: rowsToUsers(dbRes)[0] };
  }

  // Create User
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: RegisterInput,
    @Ctx() { req, pool }: MyContext
  ): Promise<UserResponse> {
    // email must have @, etc
    const errors = validateRegister(options);
    if (errors) {
      return { errors };
    }

    try {
      const hashedPassword = await argon2.hash(options.password);
      const pg = await pool.connect();
      const dbRes = await pg.query(
        `
        INSERT INTO users (first_name, last_name, email, password, created_at, updated_at) 
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *
        `,
        [options.firstName, options.lastName, options.email, hashedPassword]
      );
      pg.release();
      if (dbRes.rowCount > 0) {
        const newUser: UserGQL = rowsToUsers(dbRes)[0];
        // Set session's userId
        req.session!.userId = newUser.userId;
        return { user: newUser };
      }
    } catch (err) {
      if (err.code === "23505") {
        return { errors: [{ message: "email taken", field: "email" }] };
      }
    }

    return {
      errors: [
        {
          field: "register",
          message: "unable to register",
        },
      ],
    };
  }

  // User Login
  @Mutation(() => UserResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { pool, req }: MyContext
  ): Promise<UserResponse> {
    try {
      const pg = await pool.connect();
      const dbRes = await pg.query("SELECT * FROM users WHERE email = $1", [
        email,
      ]);
      pg.release();
      if (dbRes.rowCount == 0) {
        return {
          errors: [
            {
              field: "email",
              message: "no account with this email",
            },
          ],
        };
      }
      const user = rowsToUsers(dbRes)[0];
      if (user.password[0] != "$") {
        throw new Error("password was not hashed properly");
      }
      if (!(await argon2.verify(user.password, password))) {
        return {
          errors: [
            {
              field: "password",
              message: "wrong password",
            },
          ],
        };
      }
      req.session!.userId = user.userId;
      return { user: user };
    } catch (err) {
      console.log(err);
    }
    return {};
  }

  // Logout User
  @Mutation(() => UserResponse)
  async logout(@Ctx() { pool, req }: MyContext): Promise<UserResponse> {
    const pg = await pool.connect();
    const dbRes = await pg.query("SELECT * FROM users WHERE user_id = $1", [
      req.session!.userId,
    ]);
    pg.release();
    if (dbRes.rowCount == 0) {
      return {
        errors: [
          {
            field: "userID",
            message: "this user does not exist",
          },
        ],
      };
    }
    req.session!.destroy((err) => console.log(err));
    return { user: rowsToUsers(dbRes)[0] };
  }

  // Delete User
  @Mutation(() => UserResponse)
  async deleteUser(
    @Arg("id") id: number,
    @Ctx() { pool }: MyContext
  ): Promise<UserResponse> {
    const pg = await pool.connect();
    const dbRes = await pg.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING *",
      [id]
    );
    pg.release();
    if (dbRes.rowCount == 0) {
      return {
        errors: [
          {
            field: "userID",
            message: "this user does not exist",
          },
        ],
      };
    }
    return { user: rowsToUsers(dbRes)[0] };
  }

  // Get all Users
  @Query(() => [UserGQL], { nullable: true })
  async users(@Ctx() { pool }: MyContext): Promise<UserGQL[]> {
    const pg = await pool.connect();
    const dbRes = await pg.query("SELECT * FROM users");
    pg.release();
    return rowsToUsers(dbRes);
  }

  // Get one User
  @Query(() => UserResponse)
  async getUser(
    @Ctx() { pool }: MyContext,
    @Arg("id") id: number
  ): Promise<UserResponse> {
    const dbRes = await pool.query("SELECT * FROM users WHERE user_id = $1", [
      id,
    ]);
    if (dbRes.rowCount == 0) {
      return {
        errors: [{ message: "userID", field: "no user exists with this ID" }],
      };
    }
    const data: UserGQL[] = rowsToUsers(dbRes);
    return { user: data[0] };
  }

  // changes signed in user's password, to test updated_at
  @Mutation(() => UserResponse)
  async changePassword(
    @Ctx() { pool, req }: MyContext,
    @Arg("newPass") newPass: string
  ): Promise<UserResponse> {
    if (!req.session!.userId) {
      return {
        errors: [{ message: "session", field: "not logged in" }],
      };
    }
    const hashedPass = await argon2.hash(newPass);
    const dbRes = await pool.query(
      "UPDATE users SET password=$1 WHERE user_id = $2 RETURNING *",
      [hashedPass, req.session.userId]
    );
    if (dbRes.rowCount == 0) {
      return {
        errors: [{ message: "update", field: "could not update password" }],
      };
    }

    return { user: rowsToUsers(dbRes)[0] };
  }

  // Update User ; new email? name?
}
