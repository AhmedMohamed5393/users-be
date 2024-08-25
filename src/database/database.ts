import { EventEmitter } from "events";
import { DataSource, DataSourceOptions, Repository } from 'typeorm';
import { getLogger } from "../shared/utils/helpers";
import { ILogger } from "../shared/interfaces/ILogger";
import {
    DB_HOST,
    DB_LOGGING,
    DB_NAME,
    DB_PASSWORD,
    DB_PORT,
    DB_SYNC,
    DB_USERNAME,
} from "../environment";

const TAG = "users-be:database";

export class Database {
    private isConnected = false;
    public static events = new EventEmitter();
    public connection: DataSource;
    public repository: Repository<any>;

    constructor() {
        this.initialize();
    }

    public getRepository(entity: any): Repository<any> {
        try {
            if (!this.isConnected) {
                this.isConnected = true;
            }

            return this.connection.getRepository(entity);
        } catch (error) {
            const log: ILogger = { message: error, tag: TAG, status: 500 };
            getLogger(log);
        }
    }

    public destroy() {        
        this.connection.destroy();
    }

    private async initialize() {
        this.connection = await new DataSource(dbConfig).initialize();
        
        Database.events.once(
            "database connected",
            () => console.log("Fire database-connected"),
        );

        Database.events.once(
            "database disconnected",
            () => console.log("Fire database-disconnected"),
        );
    }
}

const dbConfig: DataSourceOptions = {
    type: 'mysql',
    database: DB_NAME,
    username: DB_USERNAME,
    password: DB_PASSWORD,
    port: DB_PORT,
    host: DB_HOST,
    synchronize: DB_SYNC,
    logging: DB_LOGGING,
    entities: ["dist/entity/*.js"],
};
