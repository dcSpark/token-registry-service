import cors from 'cors';
import parser from 'body-parser';
import compression from 'compression';
import type { NextFunction, Request, Response, Router } from 'express';

export const handleCors = (router: Router): Router =>
  router.use(cors({ credentials: true, origin: true }));

export const handleBodyRequestParsing = (router: Router): void => {
  router.use(parser.urlencoded({ extended: true }));
  router.use(parser.json({limit: '10mb'}));
};

export const handleCompression = (router: Router): void => {
  router.use(compression());
};

export const logErrors = (err: Error, req: Request, res: Response, next: NextFunction): void => {
  const errStr = `ERROR url: ${req.url}\n      stack: ${err.stack}\n      message: ${err.message}`;
  console.log(errStr);
  next(err);
};

export const errorHandler = (err: Error, req: Request, res: Response, _: NextFunction): void => {
  res.status(500).send({ error: { response: err.message } });
};
