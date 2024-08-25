import * as express from "express";

export interface IService {
    signup(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;

    signin(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;

    verifyEmail(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;
    
    create(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;

    findAll(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;

    findOne(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;

    update(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;

    delete(req: express.Request, res: express.Response, next: express.NextFunction): Promise<any>;
}
