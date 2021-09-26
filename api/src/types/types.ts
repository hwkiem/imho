import { Request, Response } from 'express';
import { googleMapsHandler } from '../dataSources/mapsAPI';
import { postgresHandler } from '../dataSources/postgres';

export type MyContext = {
    req: Request;
    res: Response;
    dataSources: {
        pgHandler: postgresHandler;
        googleMapsHandler: googleMapsHandler;
    };
};

export type ReviewIdTuple = {
    user_id: number;
    res_id: number;
};
