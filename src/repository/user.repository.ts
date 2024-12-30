import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserRepository } from "../implements/user.implement";
import { AppDataSource } from "../data-source";
import { CreateUserDTO } from "../dtos/create-user.dto";

export class TypeOrmUserRepository implements UserRepository {
    async login(encryptedData: string): Promise<User | null> {
        const repository = await AppDataSource.getRepository(User)
        const user = await repository.findOne({
            where: { userDocument: encryptedData }
        })
        return user
    }

    async createUser(data: CreateUserDTO): Promise<User | undefined> {
        const repository: Repository<User> = await AppDataSource.getRepository(User)
        return repository.save(data)
    }

    async deleteUser(id: string): Promise<User | null> {
        const repository: Repository<User> = await AppDataSource.getRepository(User)
        const user = await repository.findOne({ 
            where: { 
                id: parseInt(id) 
            } 
        })
        if (!user) {
            return null
        }

        return repository.remove(user)
    }

    async getUsers(): Promise<User[] | null> {
        const repository: Repository<User> = await AppDataSource.getRepository(User)
        return repository.find()
    }

}