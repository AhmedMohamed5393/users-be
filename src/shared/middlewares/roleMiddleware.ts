import { Request, Response, NextFunction } from "express";
import { IMiddleware } from "../interfaces/IMiddleware";
import { getLogger } from "../utils/helpers";
import { RoleEnum } from "../enums/role.enum";

const TAG = "users-be:roleMiddleware";

export class RoleMiddleware implements IMiddleware {
    constructor() {}

    public async execute(req: Request, res: Response, next: NextFunction) {        
        try {
            const user = res.locals.user;
            if (user.role != RoleEnum.admin) {
                res.status(403).json({ message: "Forbidden to access" });
            }
            
            next();
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:roleMiddleware`,
                status: 500,
            };

            getLogger(log);
        }
    }
}
