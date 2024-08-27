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
import { User } from "../modules/user/models/entities/user.entity";
import { LoginEvent } from "../modules/user/models/entities/login-event.entity";

const TAG = "users-be:database";

export class Database {
    private isConnected = false;
    public static events = new EventEmitter();
    public connection: DataSource;
    public repository: Repository<any>;

    constructor() {
        this.initialize();
    }

    public async getRepository(entity: any): Promise<Repository<any>> {
        try {
            if (!this.isConnected) {
                this.isConnected = true;
                await this.connection.initialize();
                Database.events.emit("database connected");
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
        this.connection = new DataSource(dbConfig);

        Database.events.once(
            "database connected",
            () => console.log("Database connected."),
        );

        Database.events.once(
            "database disconnected",
            () => console.log("Database disconnected."),
        );

        try {
            await this.connection.initialize();
            this.isConnected = true;
            Database.events.emit("database connected");
        } catch (error) {
            console.error("Failed to connect to the database:", error);
        }
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
    entities: [User, LoginEvent],
    migrations: ["src/database/migration/**/*.ts"],
};
