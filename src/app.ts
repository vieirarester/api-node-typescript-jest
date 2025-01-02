import express, { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import { AppDataSource } from './infrastructure/database/data-source'
import { userRouter } from './application/routes/user.route'
import bodyParser from 'body-parser'
import { errorHandler } from './application/middlewares/error.middleware'

dotenv.config()

AppDataSource.initialize().then(() => {
    const port = 3000
    const app = express()

    app.use(express.json())
    app.use(bodyParser.json())

    app.use("/users", userRouter);
    
    app.use(errorHandler as (err: any, req: Request, res: Response, next: NextFunction) => void)
 
    app.listen(port, () => {
        console.log(`Server is running on PORT ${port}`)
    })
})
