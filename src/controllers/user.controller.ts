import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CreateUserDTO } from "../dtos/create-user.dto";
import { ValidationError } from "../middlewares/validation.middleware";
import { LoginUserDTO } from "../dtos/login-user.dto";

export class UserController {
    static async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UserService.getUsers()
            res.status(200).json({ users })
        } catch (error) {
            next(error)
        }
    }
    
    static async login(req: Request, res: Response, next: NextFunction) {
        try {
            const data: LoginUserDTO = req.body
            await UserService.login(data)
            res.status(201).json({message: "User is logging"})
        } catch (error) {
        
        }
    }

    static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: CreateUserDTO = req.body
            await UserService.createUser(data)
            res.status(201).json({ message: "User created successfully" });
        } catch (error) {
            if (error instanceof ValidationError) {
                res.status(400).json({ message: error.message });
                return
            }
            next(error)
        }
    }

}