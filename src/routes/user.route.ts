import * as express from "express";
import { UserController } from "../controllers/user.controller";

const Router = express.Router()

Router.get("/", UserController.getUsers)

export { Router as userRouter }