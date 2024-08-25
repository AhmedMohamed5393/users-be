import { ServiceConfig } from "./config";
import { MiddlewareFactory } from "../../shared/middlewares/middlewareFactory";
import { Service } from "./service";

class ServiceFactory {
    public static getConfig() {
        return new ServiceConfig();
    }

    public static createModule() {
        return new Service();
    }

    public static createMiddlewareFactory() {
        return new MiddlewareFactory();
    }
}

export {
    Service,
    ServiceConfig,
    MiddlewareFactory,
};
export default ServiceFactory;
