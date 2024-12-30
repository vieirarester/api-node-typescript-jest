import { CryptoUtil } from "../utils/crypto.util";

export class CryptoProvider {
    static create(): CryptoUtil {
        const saltKey = process.env.SALT_KEY
        const secretKey = process.env.JWT_SECRET
        
        if(!saltKey || !secretKey) {
            throw new Error("Environment variables must be defined");
        }
        return new CryptoUtil(saltKey, secretKey)
    }
}