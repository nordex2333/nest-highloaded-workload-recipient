import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

let cache = new Map<string, { data: any, expires: number }>();
let CACHE_TTL = 10 * 1000;

@Injectable()
export class CacheMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.method !== 'GET') return next();

    let key = req.originalUrl;
    let cached = cache.get(key);

    if (cached && cached.expires > Date.now()) {
      return res.json(cached.data);
    }

    let originalJson = res.json.bind(res);
    res.json = (body: any) => {
      cache.set(key, { data: body, expires: Date.now() + CACHE_TTL });
      return originalJson(body);
    };

    next();
  }
}