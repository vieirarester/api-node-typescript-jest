import * as crypto from "crypto"
import jwt from "jsonwebtoken"
interface ContentPayload {
    id: number
    userDocument: string
}
export class CryptoUtil {
    private saltKey: crypto.BinaryLike | crypto.KeyObject
    private secretKey: string

    constructor(saltKey: crypto.BinaryLike | crypto.KeyObject, secretKey: string) {
        this.saltKey = saltKey
        this.secretKey = secretKey
    }

    hash(field: string): string {
        return crypto.createHmac("sha256", this.saltKey).update(field).digest("hex");
    }

    generateToken(payload: ContentPayload) {
        return jwt.sign(payload, this.secretKey, { 
            expiresIn: '1h',
            algorithm: 'HS256',      
        })
    }

}