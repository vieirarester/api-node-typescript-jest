import { CreateUserDTO } from "../dtos/create-user.dto";
import { LoginUserDTO } from "../dtos/login-user.dto";
import { CryptoProvider } from "../factories/crypto.factory";
import { UserRepositoryProvider } from "../factories/user.repository.factory";
import { NotFoundException } from "../../domain/errors/not-found-error";
import { ValidationException } from "../../domain/errors/validation-error";
import { UpdateUserDTO } from "../dtos/update-user.dto";
import { User } from "../../domain/entity/User";

export class UserService {
    static cryptoUtil = CryptoProvider.create()
    static userRepository = UserRepositoryProvider.create()

    static async login(data: LoginUserDTO): Promise<string> {
        const { cryptoUtil } = this

        this.isValidField(data.userDocument)

        const encryptedUserDocument = cryptoUtil.hash(data.userDocument)

        const user = await this.userRepository.login(encryptedUserDocument)
        if (!user) {
            throw new NotFoundException('Field is incorrect')
        }

        const payload = { id: user.id, userDocument: user.userDocument }

        return cryptoUtil.generateToken(payload)
    }

    static async createUser(data: CreateUserDTO): Promise<User> {
        const { userDocument, creditCardToken } = data
        
        this.isValidField(userDocument)
        this.isValidField(creditCardToken)

        const { cryptoUtil } = this

        const encryptedData: CreateUserDTO = {
            ...data,
            userDocument: cryptoUtil.hash(userDocument),
            creditCardToken: cryptoUtil.hash(creditCardToken),
        }
        return this.userRepository.createUser(encryptedData)
    }

    static async getUsers(): Promise<User[] | null> {
        const users = await this.userRepository.getUsers();
        return users
    }

    static async deleteUser(id: string | undefined): Promise<void> {
        if (!id || id.trim() === '') {
            throw new ValidationException('Invalid ID provided')
        }

        const user = await this.userRepository.deleteUser(id)
        if (!user) {
            throw new NotFoundException('User not found')
        }

        return 
    }

    static async update(data: UpdateUserDTO, id: string): Promise<User | void> {
        if (!id || id.trim() === '') {
            throw new ValidationException('Invalid ID provided')
        }
        
        this.isValidField(data.userDocument)
        this.isValidField(data.creditCardToken)        

        const user = await this.userRepository.exist(parseInt(id))

        if (!user) {
            throw new NotFoundException('User not found')
        }

        const { cryptoUtil } = this

        const encryptedData = {
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

    static isValidField(field: string): boolean | void {
        if (!(field.length == 11)) {
            throw new ValidationException('The field must have 11 characters')
        }
        return true
    }
}