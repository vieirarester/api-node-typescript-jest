// METHOD DESCRIBE -> bloco tests - tests suites (classes)
// METHOD IT or TEST -> declara unico teste unitario - tests cases
// METHOD EXPECT -> asserções do resultado, validar resultados

import { Long } from "mongodb";
import { UserService } from "../../application/services/user.service"
import { NotFoundException } from "../../domain/errors/not-found-error"
import { ValidationException } from "../../domain/errors/validation-error";
import { mockUserRepository } from "../mocks/user-repository.mock";
import { mockCryptoUtil } from "../mocks/crypto-provider.mock";
import { userListMock } from "../mocks/user-list.mock";
import { User } from "../../domain/entity/User";
import { UpdateUserDTO } from "../../application/dtos/update-user.dto";

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

        mockUserRepository.deleteUser.mockImplementation((user: User) => {
            const index = userListMock.findIndex((u) => u.id === user.id)
            if (index === -1) {
                throw new NotFoundException("User not found")
            }
            userListMock.splice(index, 1)
        });

        mockUserRepository.update.mockImplementation((data: UpdateUserDTO, id: number) => {
            userListMock.forEach(u => {
                if (u.id === id) {
                    u.userDocument = data.userDocument
                    u.creditCardToken = data.creditCardToken
                    u.value = data.value
                }
            })
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

    describe("Exclude", () => {

        test("should throw ValidationException if ID is invalid", async () => {
            await expect(UserService.deleteUser(" ")).rejects.toThrow(ValidationException)
        })

        test("should throw NotFoundException if user does not exist", async () => {
            jest.spyOn(UserService, "exist").mockResolvedValue(null);
            await expect(UserService.deleteUser("123")).rejects.toThrow(NotFoundException)
        })

        test("should delete user successfully", async () => {
            const userFounded =
                {
                    id: 1,
                    userDocument: "hashed-12345678910",
                    creditCardToken: "hash-crediktoken",
                    value: Long.fromNumber(1000)
                }
            jest.spyOn(UserService, "exist").mockResolvedValue(userFounded)
            await expect(UserService.deleteUser("1")).resolves.toBeUndefined()
            expect(mockUserRepository.deleteUser).toHaveBeenCalledWith(userFounded)
        })
    })

    describe("Update", () => {
        test("should throw ValidationException if ID is invalid", async () => {
            await expect(UserService.update({
                userDocument: "12345678910",
                creditCardToken: "validtoken1",
                value: Long.fromNumber(1000)
            }, " ")).rejects.toThrow(ValidationException)
        })

        test("should throw if the userDocument not have 11 letters", async () => {
            await expect(
                UserService.update({ 
                    userDocument: "1234567891", 
                    creditCardToken: "25iaaR8hjGl",
                    value: Long.fromNumber(1100) 
                }, "1")
            ).rejects.toThrow(ValidationException)
        })

        test("should throw if the creditCardToken not have 11 letters", async () => {
            await expect(
                UserService.update({ 
                    userDocument: "12345678910", 
                    creditCardToken: "25iaaR8hjG",
                    value: Long.fromNumber(1800) 
                }, "1")
            ).rejects.toThrow(ValidationException)
        })
        
        test("should throw NotFoundException if user does not exist", async () => {
            jest.spyOn(UserService, "exist").mockResolvedValue(null);
            await expect(UserService.update({ 
                    userDocument: "12345678910", 
                    creditCardToken: "25iaaR8hjGi",
                    value: Long.fromNumber(1800) 
                },"123")).rejects.toThrow(NotFoundException)
        })

        test("should user updated successfully",async () => {
            const userFounded = {
                id: 1,
                userDocument: "hashed-12345678910",
                creditCardToken: "hash-crediktokenupdate",
                value: Long.fromNumber(1000)
            }
            mockUserRepository.exist.mockResolvedValue(userFounded)
            await expect(UserService.update({
                userDocument: "12345678910",
                creditCardToken: "creditokenU",
                value: Long.fromNumber(1000)
            }, "1")).resolves.toBeUndefined()

            expect(mockUserRepository.update).toHaveBeenCalledWith(
                expect.objectContaining({
                    userDocument: expect.any(String),
                    creditCardToken: expect.any(String),
                    value: Long.fromNumber(1000)
                }), 1)
        })

    })
})