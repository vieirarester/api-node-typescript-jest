import * as express from "express";
import { UserController } from "../controllers/user.controller";

const Router = express.Router()

Router.get("/", UserController.getUsers)
Router.post("/signup", UserController.create)
Router.post("/login", UserController.login)

export { Router as userRouter }