import {  Repository } from "typeorm";
import { User } from "../entity/User";
import { UserRepository } from "../implements/user.implement";
import { AppDataSource } from "../data-source";

export class TypeOrmUserRepository implements UserRepository{
    async getUsers(): Promise<User[] | null> {
        const repository: Repository<User> = await AppDataSource.getRepository(User)
        return repository.find()
    }

}