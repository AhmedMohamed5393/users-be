import { getLogger } from "../../../shared/utils/helpers";
import { Database } from "../../../database/database";
import { Repository } from "typeorm";
import { ILoginEventRepository } from "../models/interfaces/classes/ILoginEventRepository";
import { LoginEvent } from "../models/entities/login-event.entity";

const TAG = "users-be:user:loginEventRepository";

export class LoginEventRepository implements ILoginEventRepository {
    private eventModel: Promise<Repository<LoginEvent>>;
    private database: Database;
    
    constructor() {
        this.database = new Database();
        this.eventModel = this.database.getRepository(LoginEvent);
    }

    public async addEvent(payload: LoginEvent): Promise<LoginEvent> {
        try {
            return await (await this.eventModel).save(payload);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:addEvent`,
                status: 500,
            };

            getLogger(log);
        }
    }
}
