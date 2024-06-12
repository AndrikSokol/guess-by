import { MigrationInterface, QueryRunner } from 'typeorm';
import { path as rootPath } from 'app-root-path';
import * as path from 'path';
import { readFile } from 'fs-extra';
import { USER_DATA } from '@/constants/userData';
import { Level } from '@/enum/level.enum';
import { PROFILE_DATA } from '@/constants/profileData';
import { ROOM_DATA, ROOM_USER } from '@/constants/roomData';
import { GAME_DATA, GAME_LOCATIONS_DATA } from '@/constants/gameData';
import { getScores } from '@/constants/scoreData';

export class Data1716844375599 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "user" (first_name, last_name, email,username, role, password_hash) VALUES 
        ${USER_DATA.map((user) => `('${user.firstName}', '${user.lastName}', '${user.email}','${user.username}','${user.role}', '${user.passwordHash}')`).join(',')}
        `);

    await queryRunner.query(`
        INSERT INTO "profile" (user_id, birthdate) VALUES 
        ${PROFILE_DATA.map((profile) => `(${profile.userId}, '${profile.birthdate}')`).join(',')}
        `);

    const levelValues = Object.values(Level);
    await queryRunner.query(`
        INSERT INTO "level" (name) VALUES 
        ${levelValues.map((level) => `( '${level}')`).join(',')}
    `);

    const jsonFilePath = path.join(
      rootPath,
      'src',
      'constants',
      'easyLevel.json',
    );
    const data = JSON.parse(await readFile(jsonFilePath, 'utf8'));

    for (const location of data) {
      await queryRunner.query(
        `INSERT INTO "location" (id, pano_id, lat, lng, heading, pitch, image_date, level_id) VALUES
                                                                (DEFAULT, $1, $2, $3, $4, $5, $6, $7)`,
        [
          location.panoId,
          location.lat,
          location.lng,
          location.heading,
          location.pitch,
          location.imageDate,
          1,
        ],
      );

      // Insert links if any
      if (location.links && location.links.length > 0) {
        const locationIdResult = await queryRunner.query(
          `SELECT id FROM "location" WHERE pano_id = $1`,
          [location.panoId],
        );
        const locationId = locationIdResult[0].id;
        for (const link of location.links) {
          await queryRunner.query(
            `INSERT INTO "link" (id, link, location_id) VALUES
                                                                    (DEFAULT, $1, $2)`,
            [link, locationId],
          );
        }
      }
    }

    const jsonFilePathLandmark = path.join(
      rootPath,
      'src',
      'constants',
      'landmarks.json',
    );
    const landmarkData = JSON.parse(
      await readFile(jsonFilePathLandmark, 'utf8'),
    );

    for (const location of landmarkData) {
      await queryRunner.query(
        `INSERT INTO "location" (id, pano_id, lat, lng, heading, pitch, image_date, level_id) VALUES
                                                                (DEFAULT, $1, $2, $3, $4, $5, $6, $7)`,
        [
          location.panoId,
          location.lat,
          location.lng,
          location.heading,
          location.pitch,
          location.imageDate,
          4,
        ],
      );

      // Insert links if any
      if (location.links && location.links.length > 0) {
        const locationIdResult = await queryRunner.query(
          `SELECT id FROM "location" WHERE pano_id = $1`,
          [location.panoId],
        );
        const locationId = locationIdResult[0].id;
        for (const link of location.links) {
          await queryRunner.query(
            `INSERT INTO "link" (id, link, location_id) VALUES
                                                                    (DEFAULT, $1, $2)`,
            [link, locationId],
          );
        }
      }
    }

    await queryRunner.query(`
    INSERT INTO "room" (level_id,link,status) VALUES 
    ${ROOM_DATA.map(
      (room) => `(
      ${room.levelId}, '${room.link}', '${room.status}')`,
    ).join(',')}
    `);

    await queryRunner.query(`
    INSERT INTO "room_users_user" ("userId","roomId") VALUES 
    ${ROOM_USER.map((user) => `(${user.userId}, ${user.roomdId})`).join(',')}
    `);

    let gameId = 0;

    for (const game of GAME_DATA) {
      gameId++;
      await queryRunner.query(
        `  INSERT INTO "game" (room_id,link,status,round,total_rounds) VALUES 
                                                                ($1, $2, $3, $4, $5)`,
        [game.roomId, game.link, game.status, game.round, game.totalRounds],
      );

      const gameLocations = GAME_LOCATIONS_DATA(gameId, game.totalRounds);

      await queryRunner.query(`
    INSERT INTO "game_locations_location" ("locationId", "gameId") VALUES 
    ${gameLocations.map((gameLocations) => `(${gameLocations.locationId}, ${gameLocations.gameId})`).join(',')}
    `);

      const scores = getScores(game.totalRounds, gameId, gameId);
      await queryRunner.query(`
    INSERT INTO "score" (game_id,user_id, round,score) VALUES 
    ${scores.map((score) => `(${score.gameId}, ${score.userId},${score.round},${score.score})`).join(',')}
    `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "score"`);
    await queryRunner.query(`DELETE FROM "game_locations_location"`);
    await queryRunner.query(`DELETE FROM "room_users_user"`);
    await queryRunner.query(`DELETE FROM "link"`);
    await queryRunner.query(`DELETE FROM "location"`);
    await queryRunner.query(`DELETE FROM "game"`);
    await queryRunner.query(`DELETE FROM "room"`);
    await queryRunner.query(`DELETE FROM "profile"`);
    await queryRunner.query(`DELETE FROM "level"`);
    await queryRunner.query(`DELETE FROM "user"`);
  }
}
