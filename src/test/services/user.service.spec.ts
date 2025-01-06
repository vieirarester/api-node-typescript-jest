// METHOD DESCRIBE -> bloco tests - tests suites (classes)
// METHOD IT or TEST -> declara unico teste unitario - tests cases
// METHOD EXPECT -> asserções do resultado, validar resultados

import { Long } from "mongodb";
import { DataSource } from 'typeorm';
import { UserService } from "../../application/services/user.service"
import { NotFoundException } from "../../domain/errors/not-found-error"
import { User } from '../../domain/entity/User';
import { ValidationException } from "../../domain/errors/validation-error";

describe("User Service", () => {
    let testDataSource: DataSource

    beforeAll(async () => {
        testDataSource = new DataSource({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: [User],
          synchronize: true,
          logging: false,
        });
      
        await testDataSource.initialize()
      });

    afterAll(async () => {
        if (testDataSource.isInitialized) {
            await testDataSource.destroy()
        }
    });

    afterEach(async () => {
        if (testDataSource.isInitialized) {
            const entities = testDataSource.entityMetadatas
            for (const entity of entities) {
                const repository = testDataSource.getRepository(entity.name)
                await repository.clear()
            }
        }
    });

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
    })

    describe("Login", () => {
        
        test("should throw if user not found", async () => {
            await expect(UserService.login({ userDocument: "12345678911" })
            ).rejects.toThrow(NotFoundException)
        })
        
        test("User logged", async () => {
            const user = await UserService.login({ userDocument: "12345678910" })
            expect(user).toHaveProperty('token')
        })
    })
})