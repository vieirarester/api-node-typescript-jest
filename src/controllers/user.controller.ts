import { NextFunction, Request, Response } from "express";
import { UserService } from "../services/user.service";
import { CreateUserDTO } from "../dtos/create-user.dto";
import { ValidationError } from "../middlewares/validation.middleware";

export class UserController {
    static async getUsers(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await UserService.getUsers();
            res.status(200).json({ users });
        } catch (error) {
            next(error);
        }
    }

    static async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const data: CreateUserDTO = req.body;
            await UserService.createUser(data);
            res.status(201).json({ message: "User created successfully" });
        } catch (err) {
            if (err instanceof ValidationError) {
                res.status(400).json({ message: err.message });
                return;
            }
            next(err);
        }
    }
}