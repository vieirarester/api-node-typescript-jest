import { User } from "../entity/User";

export abstract class UserRepository {
    abstract createUser(data: Object): Promise<User>
    abstract login(encryptedData: string): Promise<User | null>
    abstract getUsers(): Promise<User[] | null>
    abstract deleteUser(user: User): Promise<User | null>
    abstract update(data: Object, id: number): Promise<any>
    abstract exist(id: number): Promise<User | null>
}