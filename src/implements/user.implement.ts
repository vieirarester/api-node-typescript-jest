import { User } from "../entity/User";

export abstract class UserRepository {
    abstract getUsers(): Promise<User[] | null>
    abstract createUser(data: User): Promise<any>
    abstract login(encryptedData: string): Promise<User | null>
    abstract deleteUser(id: string): Promise<User | null>
}