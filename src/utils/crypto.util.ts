import * as crypto from "crypto"

export class CryptoUtil {
    private saltKey: crypto.BinaryLike | crypto.KeyObject

    constructor(saltKey: crypto.BinaryLike | crypto.KeyObject) {
        this.saltKey = saltKey;
    }

    hash(field: string): string {
        return crypto.createHmac("sha256", this.saltKey).update(field).digest("hex");
    }

}