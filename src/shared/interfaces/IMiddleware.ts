import * as express from "express";

export interface IMiddleware {
    execute(req: express.Request,res: express.Response,next: express.NextFunction): void;
}
