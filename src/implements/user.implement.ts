import { User } from "../entity/User";

export abstract class UserRepository {
    abstract getUsers(): Promise<User[] | null>
    abstract createUser(data: User): Promise<any>
}