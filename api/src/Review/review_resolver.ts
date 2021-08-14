import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Review } from "./Reviews";
import { MyContext } from "../types";
import { rowsToReviews } from "../utils/queryUtils";
import { ReviewQueryInput, ReviewResponse, WriteReviewInput } from "../types";

@Resolver(Review)
export class ReviewResolver {
  @Mutation(() => ReviewResponse)
  async writeReview(
    @Arg("options") options: WriteReviewInput,
    @Ctx() { pool, req }: MyContext
  ): Promise<ReviewResponse> {
    if (!req.session.userId) {
      return { errors: [{ message: "session", field: "not logged in" }] };
    }
    try {
      const pg = await pool.connect();
      const dbRes = await pg.query(
        `
        INSERT INTO reviews (res_id, user_id, rating, rent, created_at, updated_at)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *
        `,
        [options.res_id, req.session.userId, options.rating, options.rent]
      );
      pg.release();
      if (dbRes.rowCount == 0) {
        return { errors: [{ message: "insert", field: "could not insert" }] };
      }
      return { review: rowsToReviews(dbRes)[0] };
    } catch (errs) {
      if (errs.code == 23505) {
        return {
          errors: [
            {
              message: "duplicate",
              field: "you have already reviewed this residency",
            },
          ],
        };
      }
      if (errs.code == 23503) {
        return {
          errors: [
            {
              message: "foreign key",
              field: "this res_id does not exist in residences",
            },
          ],
        };
      }
      console.log(errs);
    }
    return {};
  }

  @Query(() => [Review])
  async getReviews(
    @Arg("reviewQueryInput", { nullable: true })
    reviewQueryInput: ReviewQueryInput,
    @Ctx() { pool }: MyContext
  ): Promise<Review[]> {
    if (!reviewQueryInput.reviews) {
      const pg = await pool.connect();
      const dbRes = await pg.query(`SELECT * FROM reviews`);
      pg.release();
      return rowsToReviews(dbRes);
    }
    const placeholders = reviewQueryInput.reviews
      .map((_, i) => {
        return "$" + (i + 1);
      })
      .join(",");

    const dbRes = await pool.query(
      "SELECT * FROM reviews WHERE res_id in (" + placeholders + ")",
      reviewQueryInput.reviews
    );
    return rowsToReviews(dbRes);
  }

  @Mutation(() => ReviewResponse)
  async updateRating(
    @Arg("resId") resId: number,
    @Arg("newRating") newRating: number,
    @Ctx() { pool, req }: MyContext
  ): Promise<ReviewResponse> {
    if (!req.session.userId) {
      return { errors: [{ message: "session", field: "not logged in" }] };
    }
    try {
      const pg = await pool.connect();
      const dbRes = await pool.query(
        `
        UPDATE reviews SET rating=$1 WHERE user_id = $2 AND res_id = $3 RETURNING *
        `,
        [newRating, req.session.userId, resId]
      );
      pg.release();
      if (dbRes.rowCount == 0) {
        return { errors: [{ message: "insert", field: "could not insert" }] };
      }
      const res = rowsToReviews(dbRes)[0];
      return { review: res };
    } catch (errs) {
      if (errs.code == 23505) {
        return {
          errors: [
            {
              message: "duplicate",
              field: "you have already reviewed this residence",
            },
          ],
        };
      }
      console.log(errs);
    }
    return {};
  }
}

// filter by apptNo
