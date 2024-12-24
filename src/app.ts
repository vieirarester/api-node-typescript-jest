import express from 'express'
import dotenv from 'dotenv'
import { AppDataSource } from './data-source'
import { userRouter } from './routes/user.route'
import { errorHandler } from './middlewares/error.middleware'

dotenv.config()

AppDataSource.initialize().then(() => {
    const app = express()

    app.use(express.json())
    const port = 3000

    app.use("/users", userRouter); 
 
    app.listen(port, () => {
        console.log(`Server is running on PORT ${port}`)
    })

})
