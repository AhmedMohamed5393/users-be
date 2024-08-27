import { UserRepository } from "./userRepository";
import { LoginEventRepository } from "./loginEventRepository";

export class RepositoriesFactory {
    constructor() {
        this.repositoriesMap = new Map<string, any>();

        this.createRepositories();
    }

    private repositoriesMap: Map<string, any>;

    private static instance: RepositoriesFactory;

    public static get Instance() {
        return RepositoriesFactory.instance || (
            RepositoriesFactory.instance = new RepositoriesFactory()
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

        this.repositoriesMap.set(
            LoginEventRepository.name,
            new LoginEventRepository(),
        );
    }
}
