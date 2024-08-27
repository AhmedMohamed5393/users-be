import { LoginEvent } from "../../entities/login-event.entity";

export interface ILoginEventRepository {
    addEvent(payload: LoginEvent): Promise<LoginEvent>;
}
