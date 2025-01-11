import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserRepository } from "../implements/user.implement";
import { AppDataSource } from "../../infrastructure/database/data-source";

export class TypeOrmUserRepository implements UserRepository {

    async createUser(data: Object): Promise<User> {
        const repository: Repository<User> = await AppDataSource.getRepository(User)
        return repository.save(data)
    }

    async login(encryptedData: string): Promise<User | null> {
        const repository = await AppDataSource.getRepository(User)
        const user = await repository.findOne({
            where: { userDocument: encryptedData }
        })
        return user
    }

    async getUsers(): Promise<User[] | null> {
        const repository: Repository<User> = await AppDataSource.getRepository(User)
        return repository.find()
    }

    async deleteUser(user: User): Promise<User | null> {
        const repository: Repository<User> = await AppDataSource.getRepository(User)
        return repository.remove(user)
    }

    async update(data: Object, id: number): Promise<any> {
        const repository: Repository<User> = await AppDataSource.getRepository(User)
        return repository.update(id, data)
    }

    async exist(id: number): Promise<User | null> {
        const repository: Repository<User> = await AppDataSource.getRepository(User)
        const user = await repository.findOne({
            where: {
                id,
            }
        })
        return user
    }

}