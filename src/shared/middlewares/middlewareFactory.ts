import { IMiddleware } from "../interfaces/IMiddleware";
import { IMiddlewareFactory } from "../interfaces/IMiddlewareFactory";
import { AuthMiddleware } from "./authMiddleware";
import { IdValidationMiddleware } from "./idValidationMiddleware";
import { RoleMiddleware } from "./roleMiddleware";

export class MiddlewareFactory implements IMiddlewareFactory {
    private middlewareMap: Map<string, IMiddleware>;

    constructor() {
        this.middlewareMap = new Map<string, IMiddleware>();
        this.createMiddlewares();
    }

    public getMiddleware(middlewareName: string): IMiddleware {
        return this.middlewareMap.get(middlewareName);
    }
    
    private createMiddlewares(): void {
        this.middlewareMap.set(AuthMiddleware.name, new AuthMiddleware());
        this.middlewareMap.set(RoleMiddleware.name, new RoleMiddleware());
        this.middlewareMap.set(IdValidationMiddleware.name, new IdValidationMiddleware());
    }
}

export default MiddlewareFactory;
