import { Long } from "mongodb";
import { User } from "../../domain/entity/User";

export const userListMock: User[] = [
    {
        id: 1,
        userDocument: "hashed-12345678910",
        creditCardToken: "hash-crediktoken",
        value: Long.fromNumber(1000)
    }
]