import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CreateUserDTO } from "../dtos/create-user.dto";
import { ValidationException } from "../errors/validation.middleware";
import { LoginUserDTO } from "../dtos/login-user.dto";
import { NotFoundException } from "../errors/not-found.middleware";
import { UpdateUserDTO } from "../dtos/update-user.dto";

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
            const token = await UserService.login(data)
            res.status(200).json({ message: "User logged in successfully", token })
        } catch (error) {
            if (error instanceof NotFoundException) {
                res.status(400).json({ message: error.message })
                return
            }
            next(error)
        }
    }

    static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: CreateUserDTO = req.body
            await UserService.createUser(data)
            res.status(201).json({ message: "User created successfully" })
        } catch (error) {
            if (error instanceof ValidationException) {
                res.status(400).json({ message: error.message })
                return
            }
            next(error)
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id
            await UserService.deleteUser(id)
            res.status(204).send();
        } catch (error) {
            if (error instanceof NotFoundException) {
                res.status(400).json({ message: error.message })
                return
            }
            if (error instanceof ValidationException) {
                res.status(400).json({ message: error.message })
                return
            }
            next(error)
        }
    }

    static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const id = req.params.id
            const data: UpdateUserDTO  = req.body
            await UserService.update(data,id)
            res.status(201).json({ message: "User updated successfully" })
        } catch (error) {
            if (error instanceof NotFoundException) {
                res.status(400).json({ message: error.message })
                return
            }
            if (error instanceof ValidationException) {
                res.status(400).json({ message: error.message })
                return
            }
            next(error)
        }
    }

}