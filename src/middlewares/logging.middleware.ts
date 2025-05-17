import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    let start = Date.now();
    res.on('finish', () => {
      let duration = Date.now() - start;
      console.log(`[${req.method}] ${req.originalUrl} - ${duration}ms`);
    });
    next();
  }
}