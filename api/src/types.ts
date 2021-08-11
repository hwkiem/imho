import { Client } from '@googlemaps/google-maps-services-js';
import { Request, Response } from 'express';
import { Pool } from 'pg';

export type MyContext = {
  req: Request; //& { session: Express.Session };
  res: Response;
  pool: Pool;
  client: Client;
};

