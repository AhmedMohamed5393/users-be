import { Router } from "express";
import { ILogger } from "../interfaces/ILogger";
import { IEndpoint } from "../interfaces/IConfig";
import { Between } from "typeorm";

export function generateRandom (
    length = 255,
    numbersOnly = false,
) {
    let result = '';
    const characters = numbersOnly
      ? '0123456789'
      : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        result += characters.charAt(
            Math.floor(
                Math.random() * charactersLength,
            ),
        );
    }

    return result;
};

export function getLogger(log: ILogger) {
    log.status >= 400 ? console.error(log) : console.log(log);
}

export function getRoutes(
    part_url: string,
    router: Router,
    config: any,
    service: any,
) {
    config.middlewares.forEach((middleware: any) => router.use(middleware.handler));
    
    config.endpoints.forEach(
        (endpoint: IEndpoint) => {
            return router[endpoint.verb.toLowerCase()](
                `${part_url}${endpoint.url}`,
                endpoint.middlewares,
                service[endpoint.function].bind(service),
            );
        },
    );

    return router;
}

export function getDateRange(fromDate: string, toDate: string) {
    // check fromDate and toDate for swapping if needed
    let start: Date, end: Date;
    const from = !fromDate || !new Date(fromDate) ? null : new Date(fromDate);
    const to = !toDate || !new Date(toDate) ? null : new Date(toDate);
    if (from && to) {
      start = from.getTime() < to.getTime() ? from : to;
      end = to.getTime() > from.getTime() ? to : from;
    }
  
    // use default dates if needed
    const start_date = start || from || new Date('2024-01-01T00:00:00');
    const end_date = end || to || new Date();
    return Between(start_date, end_date);
}
