import { IUserRepository } from "../models/interfaces/classes/IUserRepository";
import { getDateRange, getLogger } from "../../../shared/utils/helpers";
import { Database } from "../../../database/database";
import { IVerifyUserRequest } from "../models/interfaces/requests/IVerifyUserRequest";
import { ILike, Repository } from "typeorm";
import { User } from "../models/entities/user.entity";
import { OrderEnum } from "../../../shared/enums/order.enum";
import { PageOptionsDto } from "../../../shared/pagination/pageOption.dto";
import { UpdateUserDto } from "../models/dtos/update-user.dto";

const TAG = "users-be:user:userRepository";

export class UserRepository implements IUserRepository {
    private userModel: Promise<Repository<User>>;
    private database: Database;
    
    constructor() {
        this.database = new Database();
        this.userModel = this.database.getRepository(User);
    }
    
    public async getUserBy(where: any, select: any): Promise<User> {
        try {
            return await (await this.userModel).findOne({ where, select });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:getUserBy`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async createUser(payload: User): Promise<User> {
        try {
            return await (await this.userModel).save(payload);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:createUser`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async verifyUser(payload: IVerifyUserRequest): Promise<any> {
        try {
            return await (await this.userModel).update(
                { email: payload.email },
                { is_email_verified: true },
            );
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:updateUser`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async findAll(pageOptionsDto: PageOptionsDto): Promise<any> {
        const {
            skip,
            take,
            role,
            search,
            fromDate,
            toDate,
            is_email_verified,
        } = pageOptionsDto;

        const where = [];

        const filterBy = {};

        if (is_email_verified) {
            filterBy['is_email_verified'] = is_email_verified;
        }

        filterBy['role'] = role;

        filterBy['created_at'] = getDateRange(fromDate, toDate);

        if (search?.length) {
            const items = [
              {
                name: ILike(`%${search}%`),
                ...filterBy,
              },
              {
                email: ILike(`%${search}%`),
                ...filterBy,
              },
            ];
            where.push(...items);
        } else {
            where.push(filterBy);
        }

        try {
            const [data, total] = await (await this.userModel).findAndCount({
                where: where,
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
                take: take,
                skip: skip,
                order: { created_at: OrderEnum.DESC },
            });

            return { data, total };
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:updateUser`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async findOneById(id: number): Promise<any> {
        try {
            return await (await this.userModel).findOne({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    is_email_verified: true,
                    created_at: true,
                },
            });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:updateUser`,
                status: 500,
            };

            getLogger(log);
        }
    }

    public async updateUser(id: number, payload: any): Promise<void> {
        try {
            await (await this.userModel).update(id, payload);
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
            await (await this.userModel).delete(id);
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
