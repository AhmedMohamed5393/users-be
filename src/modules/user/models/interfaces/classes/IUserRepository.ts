import { PageOptionsDto } from "../../../../../shared/pagination/pageOption.dto";
import { UpdateUserDto } from "../../dtos/update-user.dto";
import { User } from "../../entities/user.entity";
import { IVerifyUserRequest } from "../requests/IVerifyUserRequest";

export interface IUserRepository {
    getUserBy(where: any, select?: any): Promise<User>;

    createUser(payload: User): Promise<User>;

    verifyUser(payload: IVerifyUserRequest): Promise<any>;

    findAll(pageOptionsDto: PageOptionsDto): Promise<any>;

    findOneById(id: number): Promise<any>;

    updateUser(id: number, payload: UpdateUserDto): Promise<void>;

    deleteUser(id: number): Promise<void>;
}
