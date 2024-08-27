import { CreateUserDto } from "../../dtos/create-user.dto";
import { GetUsersDto } from "../../dtos/get-users.dto";
import { UpdateUserDto } from "../../dtos/update-user.dto";
import { User } from "../../entities/user.entity";
import { IUserCheck } from "../requests/IUserCheck";
import { IVerifyUserRequest } from "../requests/IVerifyUserRequest";
import { ICountUsersResponse } from "../responses/ICountUsersResponse";

export interface IUserService {
    checkExistance(info: IUserCheck): Promise<any>;

    getUserBy(where: any, select?: any): Promise<any>;

    getUserByEmailData(verifyUserRequest: IVerifyUserRequest): Promise<any>;

    createUser(payload: CreateUserDto): Promise<User>;

    verifyUserEmail(payload: IVerifyUserRequest): Promise<any>;

    findAllUsers(getUsersDto: GetUsersDto): Promise<any>;

    findOneUser(id: number): Promise<any>

    updateUser(id: number, payload: UpdateUserDto, user: User): Promise<void>;

    deleteUser(id: number): Promise<void>;

    addLoginEvent(user_id: number): Promise<any>;

    countUsers(): Promise<ICountUsersResponse>;

    getTopActiveUsers(): Promise<User[]>;

    getInactiveUsersWithDuration(interval: string): Promise<User[]>;
}
