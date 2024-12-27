import { Long } from "typeorm";

export class CreateUserDTO {
    userDocument: string;
    creditCardToken: string;
    value: Long;
}