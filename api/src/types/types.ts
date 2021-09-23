import { Request, Response } from 'express';
import { googleMapsHandler } from '../DataSources/mapsAPI';
import { postgresHandler } from '../DataSources/postgres';

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
