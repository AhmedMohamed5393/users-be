import { Request, Response, NextFunction } from "express";

export interface IService {
    signup(req: Request, res: Response, next: NextFunction): Promise<any>;

    signin(req: Request, res: Response, next: NextFunction): Promise<any>;

    verifyEmail(req: Request, res: Response, next: NextFunction): Promise<any>;
    
    create(req: Request, res: Response, next: NextFunction): Promise<any>;

    findAll(req: Request, res: Response, next: NextFunction): Promise<any>;

    findOne(req: Request, res: Response, next: NextFunction): Promise<any>;

    update(req: Request, res: Response, next: NextFunction): Promise<any>;

    delete(req: Request, res: Response, next: NextFunction): Promise<any>;

    getTopActiveUsers(req: Request, res: Response, next: NextFunction): Promise<any>;

    getInactiveUsers(req: Request, res: Response, next: NextFunction): Promise<any>;
}
