import express from 'express'
import dotenv from 'dotenv'
import { AppDataSource } from './data-source'
import { userRouter } from './routes/user.route'
import bodyParser from 'body-parser'

dotenv.config()

AppDataSource.initialize().then(() => {
    const port = 3000
    const app = express()

    app.use(express.json())
    app.use(bodyParser.json())

    app.use("/users", userRouter); 
 
    app.listen(port, () => {
        console.log(`Server is running on PORT ${port}`)
    })
})
