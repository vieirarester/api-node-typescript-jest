import * as crypto from "crypto"

export class CryptoUtil {
    private algorithm = 'aes-256-ctr'
    private secretKey: string
    private iv = crypto.randomBytes(16)

    constructor(secretKey: string) {
        this.secretKey = secretKey
    }

    public encrypt(field: string): string {
        const cipher = crypto.createCipheriv(this.algorithm, Buffer.from(this.secretKey), this.iv)
        const encrypted = Buffer.concat([cipher.update(field), cipher.final()])
        return `${this.iv.toString("hex")}:${encrypted.toString("hex")}`
    }

    public 

}