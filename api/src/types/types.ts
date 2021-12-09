import { Request, Response } from 'express';
import { GreenFlags, RedFlags } from './enum_types';

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

export type Flag = {
    topic: string;
    rev_id: number;
};

export type FlagTypeNames = 'RED' | 'GREEN';

export type FlagType<T> = T extends 'RED'
    ? RedFlags
    : T extends 'GREEN'
    ? GreenFlags
    : // : T extends 'BOTH'
      // ? RedFlags | GreenFlags
      never;
