import { Repository } from "typeorm";
import { User } from "../entity/User";
import { UserRepository } from "../implements/user.implement";
import { AppDataSource } from "../data-source";
import { CreateUserDTO } from "../dtos/create-user.dto";

export class TypeOrmUserRepository implements UserRepository {
    async login(encryptedData: string): Promise<User | null> {
        console.log("encryptedData", encryptedData)
        const repository = await AppDataSource.getRepository(User)
        const user = await repository.findOne({
            where: { userDocument: encryptedData }
        })
        return user
    }

    async createUser(data: CreateUserDTO): Promise<any> {
        const repository: Repository<User> = await AppDataSource.getRepository(User)
        return repository.save(data)
    }

    async getUsers(): Promise<User[] | null> {
        const repository: Repository<User> = await AppDataSource.getRepository(User)
        return repository.find()
    }

}