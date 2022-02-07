import { Connection, EntityManager, IDatabaseDriver } from '@mikro-orm/core';
import { Request, Response } from 'express';
import { Redis } from 'ioredis';

export interface MyContext {
    req: Request;
    res: Response;
    em: EntityManager<IDatabaseDriver<Connection>>;
    redis: Redis;
}
