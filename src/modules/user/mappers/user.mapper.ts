import { CreateUserDto } from "../models/dtos/create-user.dto";
import { UpdateUserDto } from "../models/dtos/update-user.dto";
import { User } from "../models/entities/user.entity";

export class UserMapper {
    constructor() {}

    public getCreateUserMapper(payload: CreateUserDto) {
        const user = new User();
        user.name = payload.name;
        user.email = payload.email;
        user.role = payload.role;
        user.password = payload.password;

        return user;
    }

    public getUpdateUserMapper(payload: UpdateUserDto, user: User) {
        const response = {};

        response['name'] = payload.name || user.name;
        response['email'] = payload.email || user.email;
        response['password'] = payload.password || user.password;

        return response;
    }
}
