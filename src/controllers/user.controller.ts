import { Request, Response } from "express";
import { UserService } from "../services/user.service";

export class UserController {
    static async getUsers(req: Request, res: Response) {
        const users = await UserService.getUsers();
        res.status(200).json({users})
        return;
    }
}