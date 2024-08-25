import { Request, Response, NextFunction } from "express";
import { EventEmitter } from "events";
import { getLogger } from "../../shared/utils/helpers";
import { IUserService } from "./models/interfaces/classes/IUserService";
import { UserService } from "./services/userService";
import { IUserCheck } from "./models/interfaces/requests/IUserCheck";
import { comparePassword, encryptPassword } from "../../shared/utils/bcrypt";
import { ICreateUserRequest } from "./models/interfaces/requests/ICreateUserRequest";
import { IService } from "./models/interfaces/classes/IService";
import { encryptToken } from "../../shared/utils/jwt";
import { IVerifyUserRequest } from "./models/interfaces/requests/IVerifyUserRequest";

const TAG = "users-be:user:service";

export class Service implements IService {
    private userService: IUserService;
    
    public static globalEvents = new EventEmitter();
    
    constructor() {
        this.userService = new UserService();
    }

    public async signup(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { name, email, role } = req.body;

            // check existance of user by email or name
            const checkPayload: IUserCheck = { name, email };
            const user = await this.userService.checkExistance(checkPayload);
            if (user) {
                return res.status(403).json({ message: "User is already exists" });
            }

            // encode password
            const password = await encryptPassword(req.body.password);

            // create user
            const payload: ICreateUserRequest = {
                name,
                email,
                password,
                role,
            };

            const createdUser = await this.userService.createUser(payload);
            if (!createdUser) {
                return res.status(422).json({ message: "Can't create user" });
            }

            // prepare response
            return res.status(201).json({
                message: "User is registered successfully, please verify your email",
                data: createdUser,
            });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:signup`,
                status: 500,
            };

            getLogger(log);

            return res.status(500).json({ message: "Error occurred" });
        }
    }
    
    public async signin(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { user, password } = req.body;

            // check existance of user by email or phone or name
            const checkPayload: IUserCheck = { name: user, email: user };
            const isExistUser = await this.userService.checkExistance(checkPayload);
            if (!isExistUser) {
                return res.status(404).json({ message: "User isn't found" });
            }

            // compare passwords
            const isMatch = await comparePassword(password, isExistUser.password);
            if (!isMatch) {
                return res.status(422).json({ message: "Passwords mismatch" });
            }

            if (!isExistUser.is_email_verified) {
                return res.status(422).json({ message: "Email isn't verified" });
            }

            // prepare payload with generating jwt token
            const payload = {
                sub: isExistUser.id,
                username: isExistUser.email,
                role: isExistUser.role,
            };
            const token = encryptToken(payload);
            res.cookie('token', token);

            // prepare response
            return res.status(200).json({
                message: "User is logged in successfully",
                data: { token },
            });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:signin`,
                status: 500,
            };

            getLogger(log);

            return res.status(500).json({ message: "Error occurred" });
        }
    }
    
    public async verifyEmail(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { email, email_token } = req.body;

            const payload: IVerifyUserRequest = { email, email_token };

            // check existance of user by email token and email verification
            const user = await this.userService.getUserByEmailData(payload);
            if (!user) {
                return res.status(404).json({ message: "User isn't found" });
            }

            if (user.is_email_verified) {
                return res.status(422).json({ message: "User email is already verified" });
            }

            if (email_token !== "123456") {
                return res.status(400).json({ message: "Email token is incorrect" });
            }

            // update user to be verified
            await this.userService.verifyUserEmail(payload);

            // prepare payload with generating jwt token
            const preparePayloadToken = {
                sub: user.id,
                username: user.email,
                role: user.role,
            };
            const token = encryptToken(preparePayloadToken);
            res.cookie('token', token);

            // prepare response
            return res.status(200).json({ message: "User email is verified successfully" });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:verifyEmail`,
                status: 500,
            };

            getLogger(log);

            return res.status(500).json({ message: "Error occurred" });
        }
    }

    public async create(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const { name, email, role } = req.body;

            // check existance of user by email or name
            const checkPayload: IUserCheck = { name, email };
            const user = await this.userService.checkExistance(checkPayload);
            if (user) {
                return res.status(403).json({
                    message: "User is already exists",
                });
            }

            // encode password
            const password = await encryptPassword(req.body.password);

            // create user
            const payload: ICreateUserRequest = {
                name,
                email,
                password,
                role,
            };

            const createdUser = await this.userService.createUser(payload);
            if (!createdUser) {
                return res.status(422).json({ message: "Can't create user" });
            }

            // prepare response
            return res.status(201).json({
                message: "User is created successfully",
                data: createdUser,
            });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:create`,
                status: 500,
            };

            getLogger(log);

            return res.status(500).json({ message: "Error occurred" });
        }
    }
    
    public async findAll(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const pageOptionsDto = req.query as any;
            const response = await this.userService.findAllUsers(pageOptionsDto);
            
            // prepare response
            return res.status(200).json(response);
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:findAll`,
                status: 500,
            };

            getLogger(log);

            return res.status(500).json({ message: "Error occurred" });
        }
    }
    
    public async findOne(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const id = req.params.id;
            const data = await this.userService.findOneUser(+id);
            if (!data) {
                return res.status(404).json({ message: "User isn't found" });
            }

            // prepare response
            return res.status(200).json({ data });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:findOne`,
                status: 500,
            };

            getLogger(log);

            return res.status(500).json({ message: "Error occurred" });
        }
    }

    public async update(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const id = req.params.id;
            const data = await this.userService.getUserBy(
                { id },
                {
                    id: true,
                    name: true,
                    email: true,
                    password: true,
                },
            );
            if (!data) {
                return res.status(404).json({ message: "User isn't found" });
            }

            // encode password
            let password: string;
            if (req.body.password) {
                password = await encryptPassword(req.body.password);
            }

            await this.userService.updateUser(
                +id,
                { ...req.body, password },
                data,
            );

            // prepare response
            return res.status(200).json({
                message: "User is updated successfully",
                data: { id },
            });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:update`,
                status: 500,
            };

            getLogger(log);

            return res.status(500).json({ message: "Error occurred" });
        }
    }

    public async delete(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const id = req.params.id;

            const data = await this.userService.getUserBy({ id }, { id: true });
            if (!data) {
                return res.status(404).json({ message: "User isn't found" });
            }

            await this.userService.deleteUser(+id);

            // prepare response
            return res.status(200).json({ message: "User is deleted successfully" });
        } catch (error) {
            const log = {
                message: error,
                tag: `${TAG}:delete`,
                status: 500,
            };

            getLogger(log);

            return res.status(500).json({ message: "Error occurred" });
        }
    }
}
