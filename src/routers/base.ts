import HttpResponse from "../http/response";

export type Handler<T = any> = (...args: any) => Promise<T> | T;

export interface IHttpRouter {
  get(path: string, handler: Handler): void;
  post(path: string, handler: Handler): void;
  put(path: string, handler: Handler): void;
  delete(path: string, handler: Handler): void;
}

export interface Route {
  path: RegExp;
  validator: RegExp;
  handler: Handler<HttpResponse>;
}
