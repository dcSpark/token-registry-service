import type { Response, Request } from 'express';
import type { NextFunction } from 'express';

export interface IBaseRequest extends Request {}
export interface IBaseResponse extends Response {}

export interface Dictionary<T> {
  [key: string]: T;
}

//eslint-disable-next-line
type Handler<Req, Res> = (req: Req, res: Res, next?: NextFunction) => Promise<any> | any;

export interface Route<Req, Res> {
  path: string;
  method: string;
  handler: Handler<Req, Res>;
}
