import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1704461400000 implements MigrationInterface {
  name = 'CreateUserTable1704461400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "username" character varying(50) NOT NULL,
        "email" character varying(255) NOT NULL,
        "verificationToken" character varying(255),
        "isVerified" boolean NOT NULL DEFAULT false,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_USER_USERNAME" UNIQUE ("username"),
        CONSTRAINT "UQ_USER_EMAIL" UNIQUE ("email"),
        CONSTRAINT "PK_USER_ID" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_USER_USERNAME" ON "users" ("username")
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_USER_EMAIL" ON "users" ("email")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_USER_EMAIL"`);
    await queryRunner.query(`DROP INDEX "IDX_USER_USERNAME"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
