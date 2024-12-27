import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserRepository } from "../implements/user.implement";
import { AppDataSource } from "../data-source";
import { CreateUserDTO } from "../dtos/create-user.dto";

export class TypeOrmUserRepository implements UserRepository {

    async createUser(data: CreateUserDTO): Promise<any> {
        const repository: Repository<User> = await AppDataSource.getRepository(User)
        return repository.save(data)
    }

    async getUsers(): Promise<User[] | null> {
        const repository: Repository<User> = await AppDataSource.getRepository(User)
        return repository.find()
    }

}