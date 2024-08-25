import { IConfig, IEndpoint } from "../../shared/interfaces/IConfig";
import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
import { MiddlewareFactory } from "../../shared/middlewares/middlewareFactory";
import { validationMiddleware } from "../../shared/middlewares/validationMiddleware";
import { CreateUserDto } from "./models/dtos/create-user.dto";
import { UpdateUserDto } from "./models/dtos/update-user.dto";
import { VerifyUserDto } from "./models/dtos/verify-user.dto";
import { LoginDto } from "./models/dtos/login.dto";

export class ServiceConfig implements IConfig {
    public middlewares = [
        { handler: bodyparser.json() },
        { "handler": cookieParser() },
    ];

    public middlewareFactory = new MiddlewareFactory();
    
    public endpoints: IEndpoint[] = [
        {
            url: "/auth/signup",
            verb: "post",
            middlewares: [validationMiddleware(CreateUserDto)],
            function: "signup",
        },
        {
            url: "/auth/signin",
            verb: "post",
            middlewares: [validationMiddleware(LoginDto)],
            function: "signin",
        },
        {
            url: "/auth/verify-email",
            verb: "patch",
            middlewares: [validationMiddleware(VerifyUserDto)],
            function: "verifyEmail",
        },
        {
            url: "/users",
            verb: "post",
            middlewares: [
                this.middlewareFactory.getMiddleware("AuthMiddleware").execute,
                this.middlewareFactory.getMiddleware("RoleMiddleware").execute,
                validationMiddleware(CreateUserDto),
            ],
            function: "create",
        },
        {
            url: "/users",
            verb: "get",
            middlewares: [
                this.middlewareFactory.getMiddleware("AuthMiddleware").execute,
                this.middlewareFactory.getMiddleware("RoleMiddleware").execute,
            ],
            function: "findAll",
        },
        {
            url: "/users/:id",
            verb: "get",
            middlewares: [
                this.middlewareFactory.getMiddleware("AuthMiddleware").execute,
                this.middlewareFactory.getMiddleware("RoleMiddleware").execute,
                this.middlewareFactory.getMiddleware("IdValidationMiddleware").execute,
            ],
            function: "findOne",
        },
        {
            url: "/users/:id",
            verb: "patch",
            middlewares: [
                this.middlewareFactory.getMiddleware("AuthMiddleware").execute,
                this.middlewareFactory.getMiddleware("RoleMiddleware").execute,
                this.middlewareFactory.getMiddleware("IdValidationMiddleware").execute,
                validationMiddleware(UpdateUserDto),
            ],
            function: "update",
        },
        {
            url: "/users/:id",
            verb: "delete",
            middlewares: [
                this.middlewareFactory.getMiddleware("AuthMiddleware").execute,
                this.middlewareFactory.getMiddleware("RoleMiddleware").execute,
                this.middlewareFactory.getMiddleware("IdValidationMiddleware").execute,
            ],
            function: "delete",
        },
    ];
}
