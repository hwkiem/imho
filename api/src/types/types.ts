import { Request, Response } from 'express';
import { Review } from '../Review/Review';
import { Flags } from './flags';

export type MyContext = {
    req: Request;
    res: Response;
};

export type AddressComponents = {
    formatted_address: string;
    street_num?: string;
    route?: string;
    city?: string;
    state?: string;
    postal_code?: string;
};

// you don't insert rev_id into database, for example
// useful subset of fields inserted into DB
export class FlattenedReview implements Partial<Review> {
    user_id?: number | undefined;
    flags: Flags;
    res_id: number;
    feedback?: string | undefined;
}
