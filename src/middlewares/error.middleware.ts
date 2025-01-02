import { Request, Response, NextFunction } from 'express';
import { ValidationException } from '../errors/validation-error';
import { NotFoundException } from '../errors/not-found-error';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): Response | void {
    if (err instanceof ValidationException) {
        return res.status(400).json({ error: err.message })
    }

    if (err instanceof NotFoundException) {
        return res.status(404).json({ error: err.message })
    }

    console.error(err)
    return res.status(500).json({ error: 'Internal Server Error' })
}
