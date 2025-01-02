import { Entity, PrimaryGeneratedColumn, Column, Long } from "typeorm"

@Entity('users')
export class User {

    @PrimaryGeneratedColumn("increment")
    id: number

    @Column({ type: "varchar", length: 255, nullable: false })
    userDocument: string

    @Column({ type: "varchar", length: 255, nullable: false })
    creditCardToken: string

    @Column({ type: "bigint", nullable: false })
    value: Long

}
