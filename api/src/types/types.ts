import { Request, Response } from 'express';
import { Flag } from '../Flag/Flag';
import { FlagTypes, GreenFlags, RedFlags } from './enum_types';
import { DateRange } from './object_types';

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

export type ReviewFields = {
    rating: number;

    rent?: number;

    lease_term: DateRange;

    feedback?: string;
};

export class ProcessedFlag implements Partial<Flag> {
    category: FlagTypes;
    topic: RedFlags | GreenFlags;
}
