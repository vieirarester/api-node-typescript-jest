import { CryptoUtil } from "../utils/crypto.util";

export class CryptoProvider {
    static create(): CryptoUtil {
        const saltKey = process.env.SALT_KEY
        
        if(!saltKey) {
            throw new Error("CRYPTO_SECRET_KEY is not defined in environment variables.");
        }
        return new CryptoUtil(saltKey)
    }
}