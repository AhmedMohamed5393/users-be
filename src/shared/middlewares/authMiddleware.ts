import { Request, Response, NextFunction } from "express";
import { IMiddleware } from "../interfaces/IMiddleware";
import { getLogger } from "../utils/helpers";
import { decryptToken } from "../utils/jwt";
import { UserService } from "../../modules/user/services/userService";

const TAG = "users-be:authMiddleware";

export class AuthMiddleware implements IMiddleware {
    constructor() {}

    public async execute(req: Request, res: Response, next: NextFunction) {
        const { cookies, headers } = req;
        
        try {
            const credentials: string = cookies?.token || headers?.authorization;
            if (
                !credentials ||
                !credentials.startsWith("eyJ") || // in case of using token in cookie storage
                !( // in case of using token in request headers
                    credentials.includes("Bearer ") &&
                    credentials.split(" ")[1]?.startsWith("eyJ")
                )
            ) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const token: string = credentials || credentials.split(" ")[1];
            const payload = decryptToken(token);

            const userService = new UserService();
            const user = await userService.getUserBy(
                { email: payload.username },
                ["id", "name", "email", "role"],
            );
            
            res.locals.user = user;
            
            next();
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:authMiddleware`,
                status: 500,
            };

            getLogger(log);
        }
    }
}
