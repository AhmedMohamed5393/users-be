import { UserRepository } from "../repositories/userRepository";
import { IUserRepository } from "../models/interfaces/classes/IUserRepository";
import { RepositoriesFactory } from "../repositories/repositoriesFactory";
import { IUserService } from "../models/interfaces/classes/IUserService";
import { getLogger } from "../../../shared/utils/helpers";
import { IVerifyUserRequest } from "../models/interfaces/requests/IVerifyUserRequest";
import { IUserCheck } from "../models/interfaces/requests/IUserCheck";
import { UserMapper } from "../mappers/user.mapper";
import { PageMeta } from "../../../shared/pagination/page-meta";
import { UpdateUserDto } from "../models/dtos/update-user.dto";
import { CreateUserDto } from "../models/dtos/create-user.dto";
import { User } from "../models/entities/user.entity";
import { LoginEvent } from "../models/entities/login-event.entity";
import { ILoginEventRepository } from "../models/interfaces/classes/ILoginEventRepository";
import { LoginEventRepository } from "../repositories/loginEventRepository";
import { ICountUsersResponse } from "../models/interfaces/responses/ICountUsersResponse";
import { GetUsersDto } from "../models/dtos/get-users.dto";

const TAG = "users-be:user:userService";

export class UserService implements IUserService {
    private userRepository: IUserRepository;
    private eventRepository: ILoginEventRepository;
    private repositoriesFactory: RepositoriesFactory;
    private userMapper: UserMapper;

    constructor(userRepository?: IUserRepository) {
        if (!userRepository) {
            this.repositoriesFactory = RepositoriesFactory.Instance;

            this.userRepository = this.repositoriesFactory.getRepository(UserRepository.name);
        } else {
            this.userRepository = userRepository;
        }

        this.eventRepository = this.repositoriesFactory.getRepository(LoginEventRepository.name);

        this.userMapper = new UserMapper();
    }

    public async checkExistance(info: IUserCheck): Promise<any> {
        try {
            return await this.userRepository.getUserBy(
                [{ name: info.name }, { email: info.email }],
                ["id", "email", "password", "is_email_verified"],
            );
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:checkExistance`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async getUserBy(
        where: any,
        select: any,
    ): Promise<any> {
        try {
            return await this.userRepository.getUserBy(
                where,
                select,
            );
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:getUserBy`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async getUserByEmailData(
        verifyEmailRequest: IVerifyUserRequest,
    ): Promise<any> {
        try {
            const { email } = verifyEmailRequest;

            return await this.userRepository.getUserBy(
                { email },
                {
                    id: true,
                    email: true,
                    role: true,
                    is_email_verified: true,
                },
            );
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:getUserByEmailToken`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async createUser(request: CreateUserDto): Promise<any> {
        try {
            const userPayload = this.userMapper.getCreateUserMapper(request);
            return await this.userRepository.createUser(userPayload);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:createUser`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async verifyUserEmail(request: IVerifyUserRequest): Promise<any> {
        try {
            return await this.userRepository.verifyUser(request);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:verifyUserEmail`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async findAllUsers(getUsersDto: GetUsersDto): Promise<any> {
        try {
            const response = await this.userRepository.findAll(getUsersDto);

            const data = response.data;
            const meta = new PageMeta({
                itemsPerPage: data.length,
                total: response.total,
                pageOptionsDto: getUsersDto,
            });

            return { data, meta };
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:findAllUsers`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async findOneUser(id: number): Promise<any> {
        try {
            return await this.userRepository.findOneById(id);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:findOneUser`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async updateUser(id: number, payload: UpdateUserDto, user: User): Promise<void> {
        try {
            const userToUpdate = this.userMapper.getUpdateUserMapper(payload, user)
            await this.userRepository.updateUser(id, userToUpdate);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:updateUser`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async deleteUser(id: number): Promise<void> {
        try {
            await this.userRepository.deleteUser(id);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:deleteUser`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async addLoginEvent(user_id: number): Promise<any> {
        try {
            const loginEvent = new LoginEvent();
            loginEvent.user = new User();
            loginEvent.user.id = user_id;

            await this.eventRepository.addEvent(loginEvent);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:addLoginEvent`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async countUsers(): Promise<ICountUsersResponse> {
        try {
            const registered_users = await this.userRepository.countRegisteredUsers();
            const verified_users = await this.userRepository.countVerifiedUsers();

            return {
                registered_users,
                verified_users,
            };
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:countUsers`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async getTopActiveUsers(): Promise<User[]> {
        try {
            return await this.userRepository.getTop3UsersByLoginFrequency();
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:getTopActiveUsers`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async getInactiveUsersWithDuration(interval: string): Promise<User[]> {
        try {
            const date = new Date();
            if (!interval || interval.toLowerCase() !== "month") {
                date.setHours(date.getHours() - 1);
            } else {
                date.setMonth(date.getMonth() - 1);
            }

            const users = await this.userRepository.getInactiveUsers(date);
            const data = users.map((user) => {
                delete user.login_events;

                return user;
            });

            return data;
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:getTopActiveUsers`,
                status: 500,
            };

            getLogger(log);
        }
    }
}
