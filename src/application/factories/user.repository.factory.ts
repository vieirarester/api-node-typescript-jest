import { TypeOrmUserRepository } from "../../domain/repository/user.repository";

export class UserRepositoryProvider {
    static create(): TypeOrmUserRepository {
        return new TypeOrmUserRepository()
    }
}