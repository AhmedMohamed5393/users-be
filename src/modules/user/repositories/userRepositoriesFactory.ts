import { UserRepository } from "./userRepository";
import { IUserRepository } from "../models/interfaces/classes/IUserRepository";

export class UserRepositoriesFactory {
    constructor() {
        this.repositoriesMap = new Map<string, IUserRepository>();

        this.createRepositories();
    }

    private repositoriesMap: Map<string, IUserRepository>;

    private static instance: UserRepositoriesFactory;

    public static get Instance() {
        return UserRepositoriesFactory.instance || (
            UserRepositoriesFactory.instance = new UserRepositoriesFactory()
        );
    }

    public getRepository(repositoryName: string) {
        return this.repositoriesMap.get(repositoryName);
    }

    private createRepositories() {
        this.repositoriesMap.set(
            UserRepository.name,
            new UserRepository(),
        );
    }
}
