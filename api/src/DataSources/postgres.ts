import { SQLDataSource } from "datasource-sql";
import { UserResponse } from "../types";
import { UserGQL } from "../User/user";
// import { Pool } from "pg";
// import { UserResponse } from "../types";
// import { rowsToUsers } from "../utils/queryUtils";

export class Database extends SQLDataSource {
  async getUserById(id: number): Promise<UserResponse> {
    this.knex
      .select("*")
      .from<UserGQL>("users")
      .where("user_id", "=", id)
      .then((res) => {
        return { user: res };
      })
      .catch((e) => {
        return {
          errors: [{ field: "not sure", message: e }],
        };
      });
    return {
      errors: [{ field: "catch", message: "catch" }],
    };

    // const pg = await pool.connect();
    // const dbRes = await pg.query("SELECT * FROM users WHERE user_id = $1", [
    //   userId,
    // ]);
    // pg.release();
    // if (dbRes.rowCount == 0) {
    //   return {
    //     errors: [{ field: "account", message: "no User with your id" }],
    //   };
    // }
    // return { user: rowsToUsers(dbRes)[0] };
  }
}
