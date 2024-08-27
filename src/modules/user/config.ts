import { IConfig, IEndpoint } from "../../shared/interfaces/IConfig";
import bodyparser from "body-parser";
import cookieParser from "cookie-parser";
import { MiddlewareFactory } from "../../shared/middlewares/middlewareFactory";
import { BodyRequestValidationMiddleware } from "../../shared/middlewares/bodyRequestValidationMiddleware";
import { CreateUserDto } from "./models/dtos/create-user.dto";
import { UpdateUserDto } from "./models/dtos/update-user.dto";
import { VerifyUserDto } from "./models/dtos/verify-user.dto";
import { LoginDto } from "./models/dtos/login.dto";
import { QueryRequestValidationMiddleware } from "../../shared/middlewares/queryRequestValidationMiddleware";
import { GetUsersDto } from "./models/dtos/get-users.dto";

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
            middlewares: [BodyRequestValidationMiddleware(CreateUserDto)],
            function: "signup",
        },
        {
            url: "/auth/signin",
            verb: "post",
            middlewares: [BodyRequestValidationMiddleware(LoginDto)],
            function: "signin",
        },
        {
            url: "/auth/verify-email",
            verb: "patch",
            middlewares: [BodyRequestValidationMiddleware(VerifyUserDto)],
            function: "verifyEmail",
        },
        {
            url: "/",
            verb: "post",
            middlewares: [
                this.middlewareFactory.getMiddleware("AuthMiddleware").execute,
                this.middlewareFactory.getMiddleware("RoleMiddleware").execute,
                BodyRequestValidationMiddleware(CreateUserDto),
            ],
            function: "create",
        },
        {
            url: "/",
            verb: "get",
            middlewares: [
                this.middlewareFactory.getMiddleware("AuthMiddleware").execute,
                this.middlewareFactory.getMiddleware("RoleMiddleware").execute,
                QueryRequestValidationMiddleware(GetUsersDto),
            ],
            function: "findAll",
        },
        {
            url: "/:id",
            verb: "get",
            middlewares: [
                this.middlewareFactory.getMiddleware("AuthMiddleware").execute,
                this.middlewareFactory.getMiddleware("RoleMiddleware").execute,
                this.middlewareFactory.getMiddleware("IdValidationMiddleware").execute,
            ],
            function: "findOne",
        },
        {
            url: "/:id",
            verb: "patch",
            middlewares: [
                this.middlewareFactory.getMiddleware("AuthMiddleware").execute,
                this.middlewareFactory.getMiddleware("RoleMiddleware").execute,
                this.middlewareFactory.getMiddleware("IdValidationMiddleware").execute,
                BodyRequestValidationMiddleware(UpdateUserDto),
            ],
            function: "update",
        },
        {
            url: "/top/list",
            verb: "get",
            middlewares: [
                this.middlewareFactory.getMiddleware("AuthMiddleware").execute,
                this.middlewareFactory.getMiddleware("RoleMiddleware").execute,
            ],
            function: "getTopActiveUsers",
        },
        {
            url: "/inactive/list",
            verb: "get",
            middlewares: [
                this.middlewareFactory.getMiddleware("AuthMiddleware").execute,
                this.middlewareFactory.getMiddleware("RoleMiddleware").execute,
            ],
            function: "getInactiveUsers",
        },
    ];
}
