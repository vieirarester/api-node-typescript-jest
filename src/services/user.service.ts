import { TypeOrmUserRepository } from "../repository/user.repository";

export class UserService {
    static async getUsers() {
        const userRepository = new TypeOrmUserRepository()
        const users = await userRepository.getUsers();
        return users
    }
}