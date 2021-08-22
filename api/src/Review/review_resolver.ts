import { Arg, Ctx, Int, Mutation, Query, Resolver } from 'type-graphql';
import { ReviewGQL } from './reviews';
import { MyContext, PartialReview, ResidenceResponse } from '../types';
import { ReviewResponse, WriteReviewInput } from '../types';

@Resolver(ReviewGQL)
export class ReviewResolver {
  @Mutation(() => ReviewResponse)
  async writeReview(
    @Arg('options') options: WriteReviewInput,
    @Ctx() { dataSources, req, client }: MyContext
  ): Promise<ReviewResponse> {
    if (!req.session.userId) {
      return { errors: [{ message: 'session', field: 'not logged in' }] };
    }
    // does the residence already exist?
    const res: ResidenceResponse =
      await dataSources.pgHandler.getResidencesObject({
        google_place_id: options.google_place_id,
      });
    if (res.errors || !res.residences) {
      return { errors: res.errors };
    }
    if (res.residences.length == 0) {
      // residence does not exist, create
      const response = await dataSources.pgHandler.createResidence(
        {
          google_place_id: options.google_place_id,
        },
        client
      );
      if (response.errors || !response.residences) {
        return { errors: response.errors };
      }
      options.res_id = response.residences[0].res_id;
    } else {
      options.res_id = res.residences[0].res_id;
    }
    // residence exists and user is logged in, add their review
    options.user_id = req.session.userId;
    const response = await dataSources.pgHandler.writeReview(options);
    return response;
  }

  // write update rating

  @Query(() => ReviewResponse)
  async getReviewsByUserId(
    @Arg('user_ids', () => [Int]) ids: [number],
    @Ctx() { dataSources }: MyContext
  ): Promise<ReviewResponse> {
    return await dataSources.pgHandler.getReviewsByUserId(ids);
  }

  @Query(() => ReviewResponse)
  async getReviewsByResidenceId(
    @Arg('residence_ids', () => [Int]) ids: [number],
    @Ctx() { dataSources }: MyContext
  ): Promise<ReviewResponse> {
    return await dataSources.pgHandler.getReviewsByResidenceId(ids);
  }

  @Query(() => ReviewResponse)
  async getReviewsLimit(
    @Arg('limit', () => Int) limit: number,
    @Ctx() { dataSources }: MyContext
  ): Promise<ReviewResponse> {
    return await dataSources.pgHandler.getReviewsLimit(limit);
  }

  @Query(() => ReviewResponse) // return number of rows returned? everywhere?
  async getReviewsObjFilter(
    @Arg('obj') obj: PartialReview,
    @Ctx() { dataSources }: MyContext
  ): Promise<ReviewResponse> {
    return await dataSources.pgHandler.getReviewsObject(obj);
  }
}

//     options.user_id = req.session.userId;
//     const response = dataSources.pgHandler.writeReview(options);
//     return response;

// try {
//   const pg = await pool.connect();
//   const dbRes = await pg.query(
//     `
//     INSERT INTO reviews (res_id, user_id, rating, rent, created_at, updated_at)
//     VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP) RETURNING *
//     `,
//     [options.res_id, req.session.userId, options.rating, options.rent]
//   );
//   pg.release();
//   if (dbRes.rowCount == 0) {
//     return { errors: [{ message: "insert", field: "could not insert" }] };
//   }
//   return { review: rowsToReviews(dbRes)[0] };
// } catch (errs) {
//   if (errs.code == 23505) {
//     return {
//       errors: [
//         {
//           message: "duplicate",
//           field: "you have already reviewed this residency",
//         },
//       ],
//     };
//   }
//   if (errs.code == 23503) {
//     return {
//       errors: [
//         {
//           message: "foreign key",
//           field: "this res_id does not exist in residences",
//         },
//       ],
//     };
//   }
//   console.log(errs);
// }
// return {};
//   }

//   @Query(() => [ReviewGQL])
//   async getReviews(
//     @Arg('reviewQueryInput', { nullable: true })
//     reviewQueryInput: ReviewQueryInput,
//     @Ctx() { pool }: MyContext
//   ): Promise<ReviewGQL[]> {
//     if (!reviewQueryInput.reviews) {
//       const pg = await pool.connect();
//       const dbRes = await pg.query(`SELECT * FROM reviews`);
//       pg.release();
//       return rowsToReviews(dbRes);
//     }
//     const placeholders = reviewQueryInput.reviews
//       .map((_, i) => {
//         return '$' + (i + 1);
//       })
//       .join(',');

//     const dbRes = await pool.query(
//       'SELECT * FROM reviews WHERE res_id in (' + placeholders + ')',
//       reviewQueryInput.reviews
//     );
//     return rowsToReviews(dbRes);
//   }

//   @Mutation(() => ReviewResponse)
//   async updateRating(
//     @Arg('resId') resId: number,
//     @Arg('newRating') newRating: number,
//     @Ctx() { pool, req }: MyContext
//   ): Promise<ReviewResponse> {
//     if (!req.session.userId) {
//       return { errors: [{ message: 'session', field: 'not logged in' }] };
//     }
//     try {
//       const pg = await pool.connect();
//       const dbRes = await pool.query(
//         `
//         UPDATE reviews SET rating=$1 WHERE user_id = $2 AND res_id = $3 RETURNING *
//         `,
//         [newRating, req.session.userId, resId]
//       );
//       pg.release();
//       if (dbRes.rowCount == 0) {
//         return { errors: [{ message: 'insert', field: 'could not insert' }] };
//       }
//       const res = rowsToReviews(dbRes)[0];
//       return { review: res };
//     } catch (errs) {
//       if (errs.code == 23505) {
//         return {
//           errors: [
//             {
//               message: 'duplicate',
//               field: 'you have already reviewed this residence',
//             },
//           ],
//         };
//       }
//       console.log(errs);
//     }
//     return {};
//   }

// filter by apptNo
