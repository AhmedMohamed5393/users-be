import { UserRepository } from "../repositories/userRepository";
import { IUserRepository } from "../models/interfaces/classes/IUserRepository";
import { UserRepositoriesFactory } from "../repositories/userRepositoriesFactory";
import { IUserService } from "../models/interfaces/classes/IUserService";
import { getLogger } from "../../../shared/utils/helpers";
import { ICreateUserRequest } from "../models/interfaces/requests/ICreateUserRequest";
import { IVerifyUserRequest } from "../models/interfaces/requests/IVerifyUserRequest";
import { IUserCheck } from "../models/interfaces/requests/IUserCheck";
import { UserMapper } from "../mappers/user.mapper";
import { PageOptionsDto } from "../../../shared/pagination/pageOption.dto";
import { PageMeta } from "../../../shared/pagination/page-meta";
import { UpdateUserDto } from "../models/dtos/update-user.dto";
import { CreateUserDto } from "../models/dtos/create-user.dto";
import { User } from "../models/entities/user.entity";

const TAG = "users-be:user:userService";

export class UserService implements IUserService {
    private repository: IUserRepository;
    private repositoriesFactory: UserRepositoriesFactory;
    private userMapper: UserMapper;

    constructor(repository?: IUserRepository) {
        if (!repository) {
            this.repositoriesFactory = UserRepositoriesFactory.Instance;

            this.repository = this.repositoriesFactory.getRepository(UserRepository.name);
        } else {
            this.repository = repository;
        }

        this.userMapper = new UserMapper();
    }

    public async checkExistance(
        info: IUserCheck,
    ): Promise<any> {
        try {
            return await this.repository.getUserBy(
                [{ name: info.name }, { email: info.email }],
                ["id", "email", "password", "is_email_verified"]
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
            return await this.repository.getUserBy(
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
            const { email_token, email } = verifyEmailRequest;

            return await this.repository.getUserBy(
                { email_token, email },
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
            return await this.repository.createUser(userPayload);
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
            return await this.repository.verifyUser(request);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:verifyUserEmail`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async findAllUsers(pageOptionsDto: PageOptionsDto): Promise<any> {
        try {
            const response = await this.repository.findAll(pageOptionsDto);

            const data = response.data;
            const meta = new PageMeta({
                itemsPerPage: response.data.length,
                total: response.total,
                pageOptionsDto: pageOptionsDto,
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
            return await this.repository.findOneById(id);
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
            await this.repository.updateUser(id, userToUpdate);
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
            await this.repository.deleteUser(id);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:deleteUser`,
                status: 500,
            };

            getLogger(log);
        }
    }
}
