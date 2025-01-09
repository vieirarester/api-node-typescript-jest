// METHOD DESCRIBE -> bloco tests - tests suites (classes)
// METHOD IT or TEST -> declara unico teste unitario - tests cases
// METHOD EXPECT -> asserções do resultado, validar resultados

import { Long } from "mongodb";
import { UserService } from "../../application/services/user.service"
import { NotFoundException } from "../../domain/errors/not-found-error"
import { ValidationException } from "../../domain/errors/validation-error";
import { mockUserRepository } from "../mocks/user-repository.mock";
import { mockCryptoUtil } from "../mocks/crypto-provider.mock";

jest.mock("../../application/factories/user.repository.factory", () => ({
    UserRepositoryProvider: {
        create: jest.fn(() => mockUserRepository)
    }
}))

jest.mock("../../application/factories/crypto.factory", () => ({
    CryptoProvider: {
        create: jest.fn(() => mockCryptoUtil)
    }
}))

describe("User Service", () => {
    beforeEach(() => {
        jest.clearAllMocks()

        mockUserRepository.login.mockImplementation((encryptedUserDocument: string) => {
            if (encryptedUserDocument === 'hashed-12345678910') {
                return {
                    id: "1",
                    userDocument: "hashed-12345678910"
                }
            }
        })
    })
    
    describe("Sign Up", () => {

        test("should throw if the field not have 11 letters", async () => {
            await expect(
                UserService.createUser({ 
                    userDocument: "1234567891", 
                    creditCardToken: "25iaaR8hjGl",
                    value: Long.fromNumber(1100) 
                })
            ).rejects.toThrow(ValidationException)
        })

        test("should call repository createUser with hashed data", async () => {
            await UserService.createUser({
                userDocument: "12345678910",
                creditCardToken: "validtoken1",
                value: Long.fromNumber(1000)
            })

            expect(mockCryptoUtil.hash).toHaveBeenCalledTimes(2)
            expect(mockUserRepository.createUser).toHaveBeenCalledWith({
                userDocument: "hashed-12345678910",
                creditCardToken: "hashed-validtoken1",
                value: Long.fromNumber(1000),
            })
        })
    })

    describe("Login", () => {
        
        test("should throw if user not found", async () => {
            await expect(UserService.login({ userDocument: "12345678911" })
            ).rejects.toThrow(NotFoundException)
        })
        
        test("User logged", async () => {
            const user = await UserService.login({ userDocument: "12345678910" })
            expect(user).toEqual("mocked_token")
        })
    })

})