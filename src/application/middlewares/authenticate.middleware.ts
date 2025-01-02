import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Token invalid" })
        return
    }

    const token = authHeader.split(" ")[1]

    try {
        const secretKey = process.env.JWT_SECRET!
        const decoded = jwt.verify(token, secretKey) as JwtPayload

        req.body.user = decoded
        next()
    } catch (error) {
        res.status(403).json({ message: "Invalid or expired token" })
        return 
    }
}