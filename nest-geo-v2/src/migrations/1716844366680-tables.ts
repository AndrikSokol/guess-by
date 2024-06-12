import { MigrationInterface, QueryRunner } from 'typeorm';

export class Tables1716844366680 implements MigrationInterface {
  name = 'Tables1716844366680';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "profile" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "birthdate" TIMESTAMP, "avatar" character varying, CONSTRAINT "REL_d752442f45f258a8bdefeebb2f" UNIQUE ("user_id"), CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "link" ("id" SERIAL NOT NULL, "link" character varying NOT NULL, "location_id" integer NOT NULL, CONSTRAINT "PK_26206fb7186da72fbb9eaa3fac9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "level" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_d3f1a7a6f09f1c3144bacdc6bcc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "location" ("id" SERIAL NOT NULL, "pano_id" character varying NOT NULL, "lat" double precision NOT NULL, "lng" double precision NOT NULL, "heading" integer NOT NULL, "pitch" integer NOT NULL, "image_date" character varying NOT NULL, "level_id" integer NOT NULL, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "score" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "game_id" integer NOT NULL, "score" double precision NOT NULL, "round" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_1770f42c61451103f5514134078" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "game" ("id" SERIAL NOT NULL, "room_id" integer NOT NULL, "round" integer NOT NULL DEFAULT '1', "total_rounds" integer NOT NULL, "link" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'started', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_fa4083cccb79a3e4786a991000" UNIQUE ("room_id"), CONSTRAINT "PK_352a30652cd352f552fef73dec5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "room" ("id" SERIAL NOT NULL, "level_id" integer, "link" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_c6d46db005d623e691b2fbcba23" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "google_id" character varying, "first_name" character varying, "last_name" character varying, "username" character varying NOT NULL, "email" character varying NOT NULL, "password_hash" character varying, "role" character varying(10) NOT NULL DEFAULT 'User', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "game_locations_location" ("gameId" integer NOT NULL, "locationId" integer NOT NULL, CONSTRAINT "PK_cb7fb7b165b43e060486813c618" PRIMARY KEY ("gameId", "locationId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4034950c66f636f0715859d6e3" ON "game_locations_location" ("gameId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_4656e3f8b0fa7579c958ba3da1" ON "game_locations_location" ("locationId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "room_users_user" ("roomId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "PK_e811974018202e969e902e794de" PRIMARY KEY ("roomId", "userId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_764292bbbb93544a050f844c49" ON "room_users_user" ("roomId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6c675caa22685ba1e0ebeb0f65" ON "room_users_user" ("userId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" ADD CONSTRAINT "FK_d752442f45f258a8bdefeebb2f2" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "link" ADD CONSTRAINT "FK_4453e89d9411afd6978ba2fcd91" FOREIGN KEY ("location_id") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" ADD CONSTRAINT "FK_861a7773f636dcd8660674ba05e" FOREIGN KEY ("level_id") REFERENCES "level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "score" ADD CONSTRAINT "FK_0b3074ecc6d93b5f0974a834416" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "score" ADD CONSTRAINT "FK_f823a852d476962438b5ad3bda8" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "game" ADD CONSTRAINT "FK_fa4083cccb79a3e4786a991000b" FOREIGN KEY ("room_id") REFERENCES "room"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "room" ADD CONSTRAINT "FK_6ce0366e9c1a84e824b48674d02" FOREIGN KEY ("level_id") REFERENCES "level"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_locations_location" ADD CONSTRAINT "FK_4034950c66f636f0715859d6e3a" FOREIGN KEY ("gameId") REFERENCES "game"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_locations_location" ADD CONSTRAINT "FK_4656e3f8b0fa7579c958ba3da16" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users_user" ADD CONSTRAINT "FK_764292bbbb93544a050f844c499" FOREIGN KEY ("roomId") REFERENCES "room"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users_user" ADD CONSTRAINT "FK_6c675caa22685ba1e0ebeb0f654" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "room_users_user" DROP CONSTRAINT "FK_6c675caa22685ba1e0ebeb0f654"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room_users_user" DROP CONSTRAINT "FK_764292bbbb93544a050f844c499"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_locations_location" DROP CONSTRAINT "FK_4656e3f8b0fa7579c958ba3da16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_locations_location" DROP CONSTRAINT "FK_4034950c66f636f0715859d6e3a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "room" DROP CONSTRAINT "FK_6ce0366e9c1a84e824b48674d02"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game" DROP CONSTRAINT "FK_fa4083cccb79a3e4786a991000b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "score" DROP CONSTRAINT "FK_f823a852d476962438b5ad3bda8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "score" DROP CONSTRAINT "FK_0b3074ecc6d93b5f0974a834416"`,
    );
    await queryRunner.query(
      `ALTER TABLE "location" DROP CONSTRAINT "FK_861a7773f636dcd8660674ba05e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "link" DROP CONSTRAINT "FK_4453e89d9411afd6978ba2fcd91"`,
    );
    await queryRunner.query(
      `ALTER TABLE "profile" DROP CONSTRAINT "FK_d752442f45f258a8bdefeebb2f2"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6c675caa22685ba1e0ebeb0f65"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_764292bbbb93544a050f844c49"`,
    );
    await queryRunner.query(`DROP TABLE "room_users_user"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4656e3f8b0fa7579c958ba3da1"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_4034950c66f636f0715859d6e3"`,
    );
    await queryRunner.query(`DROP TABLE "game_locations_location"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "room"`);
    await queryRunner.query(`DROP TABLE "game"`);
    await queryRunner.query(`DROP TABLE "score"`);
    await queryRunner.query(`DROP TABLE "location"`);
    await queryRunner.query(`DROP TABLE "level"`);
    await queryRunner.query(`DROP TABLE "link"`);
    await queryRunner.query(`DROP TABLE "profile"`);
  }
}
