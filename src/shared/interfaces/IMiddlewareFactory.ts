import { IMiddleware } from "./IMiddleware";

export interface IMiddlewareFactory {
    getMiddleware(middlewareName: string): IMiddleware;
}
