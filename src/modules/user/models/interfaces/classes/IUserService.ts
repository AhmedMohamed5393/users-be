import { PageOptionsDto } from "../../../../../shared/pagination/pageOption.dto";
import { CreateUserDto } from "../../dtos/create-user.dto";
import { UpdateUserDto } from "../../dtos/update-user.dto";
import { User } from "../../entities/user.entity";
import { IUserCheck } from "../requests/IUserCheck";
import { IVerifyUserRequest } from "../requests/IVerifyUserRequest";

export interface IUserService {
    checkExistance(info: IUserCheck): Promise<any>;

    getUserBy(where: any, select?: any): Promise<any>;

    getUserByEmailData(verifyUserRequest: IVerifyUserRequest): Promise<any>;

    createUser(payload: CreateUserDto): Promise<User>;

    verifyUserEmail(payload: IVerifyUserRequest): Promise<any>;

    findAllUsers(pageOptionsDto: PageOptionsDto): Promise<any>;

    findOneUser(id: number): Promise<any>

    updateUser(id: number, payload: UpdateUserDto, user: User): Promise<void>;

    deleteUser(id: number): Promise<void>;
}
