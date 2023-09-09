import { MigrationInterface, QueryRunner } from 'typeorm';

export class Users1694215188561 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS users (
            id  int NOT NULL AUTO_INCREMENT, 
            email varchar(255) NOT NULL,
            password varchar(255) NOT NULL,
            first_name varchar(255) NOT NULL,
            last_name varchar(255) NOT NULL,
            phone_number varchar(20) NOT NULL,
            user_type varchar(10) NOT NULL DEFAULT 'AGENT',
            created_at timestamp NOT NULL DEFAULT now(),
            updated_at timestamp NOT NULL DEFAULT now(),
            CONSTRAINT users_pkey PRIMARY KEY (id)
          );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "user"');
  }
}
