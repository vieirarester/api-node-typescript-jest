import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1734998210273 implements MigrationInterface {
    name = 'Default1734998210273'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "userDocument" character varying(255) NOT NULL, "creditCardToken" character varying(255) NOT NULL, "value" bigint NOT NULL, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
