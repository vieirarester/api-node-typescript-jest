import { CryptoUtil } from "../utils/crypto.util";

export class CryptoProvider {
    static create(): CryptoUtil {
        const secretKey = process.env.CRYPTO_SECRET_KEY
        
        if(!secretKey) {
            throw new Error("CRYPTO_SECRET_KEY is not defined in environment variables.");
        }
        return new CryptoUtil(secretKey)
    }
}