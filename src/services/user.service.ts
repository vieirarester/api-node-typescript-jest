import { CreateUserDTO } from "../dtos/create-user.dto";
import { LoginUserDTO } from "../dtos/login-user.dto";
import { PayloadTokenUserDTO } from "../dtos/payload-token-user.dto";
import { User } from "../entity/User";
import { CryptoProvider } from "../factories/crypto.factory";
import { UserRepositoryProvider } from "../factories/user.repository.factory";
import { NotFoundException } from "../errors/not-found.middleware";
import { ValidationException } from "../errors/validation.middleware";
import { UpdateUserDTO } from "../dtos/update-user.dto";

export class UserService {
    static userRepository = UserRepositoryProvider.create()

    static async login(data: LoginUserDTO): Promise<string> {
        const cryptoUtil = CryptoProvider.create()

        if (!(data.userDocument.length == 11)) {
            throw new ValidationException('The field must have 11 characters')
        }

        const encryptedUserDocument = cryptoUtil.hash(data.userDocument)

        const user = await this.userRepository.login(encryptedUserDocument)
        if (!user) {
            throw new NotFoundException('Field is incorrect')
        }

        const payload: PayloadTokenUserDTO = {
            id: user.id,
            userDocument: user.userDocument
        }

        return cryptoUtil.generateToken(payload)
    }

    static async createUser(data: CreateUserDTO) {
        const cryptoUtil = CryptoProvider.create()
        const { userDocument, creditCardToken } = data

        if (!(userDocument.length == 11) && !(creditCardToken.length == 11)) {
            throw new ValidationException('The field must have 11 characters')
        }

        const encryptedData: CreateUserDTO = {
            ...data,
            userDocument: cryptoUtil.hash(userDocument),
            creditCardToken: cryptoUtil.hash(creditCardToken),
        }
        return this.userRepository.createUser(encryptedData)
    }

    static async getUsers() {
        const users = await this.userRepository.getUsers();
        return users
    }

    static async deleteUser(id: string | undefined){
        if (!id || id.trim() === '') {
            throw new ValidationException('Invalid ID provided')
        }

        const user = await this.userRepository.deleteUser(id)
        if (!user) {
            throw new NotFoundException('User did not found')
        }

        return 
    }

    static async update(data: UpdateUserDTO, id: string) {
        if (!id || id.trim() === '') {
            throw new ValidationException('Invalid ID provided')
        }
        
        if (!(data.userDocument.length == 11) || !(data.creditCardToken.length == 11)) {
            throw new ValidationException('The field must have 11 characters')
        }

        const user = await this.userRepository.exist(parseInt(id))

        if (!user) {
            throw new NotFoundException('User did not found')
        }

        const cryptoUtil = CryptoProvider.create()

        const encryptedData: UpdateUserDTO = {
            userDocument: cryptoUtil.hash(data.userDocument),
            creditCardToken: cryptoUtil.hash(data.creditCardToken),
            value: data.value
        }

        return this.userRepository.update(encryptedData, parseInt(id))
    }

    static async exist(id: number) {
        const user = await this.userRepository.exist(id)
        return user
    }
}