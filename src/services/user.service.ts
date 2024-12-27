import { CreateUserDTO } from "../dtos/create-user.dto";
import { LoginUserDTO } from "../dtos/login-user.dto";
import { CryptoProvider } from "../factories/crypto.factory";
import { UserRepositoryProvider } from "../factories/user.repository.factory";
import { ValidationError } from "../middlewares/validation.middleware";

export class UserService {
    static async login(data: LoginUserDTO) {
        const cryptoUtil = CryptoProvider.create()
        
    }
    static userRepository = UserRepositoryProvider.create()

    static async createUser(data: CreateUserDTO) {
        const cryptoUtil = CryptoProvider.create()
        const { userDocument, creditCardToken } = data

        if (!(userDocument.length == 11) && !(creditCardToken.length == 11)) {
            throw new ValidationError('The field must have 11 characters')
        }

        const encryptedData: CreateUserDTO = {
            ...data,
            userDocument: cryptoUtil.encrypt(userDocument),
            creditCardToken: cryptoUtil.encrypt(creditCardToken),
        }
        return this.userRepository.createUser(encryptedData)
    }

    static async getUsers() {
        const users = await this.userRepository.getUsers();
        return users
    }
}