/** USER_DB 쿼리문 모임 스크립트 */

export const SQL_QUERIES = {
  FIND_USER_BY_DEVICE_ID: `SELECT * FROM "user" WHERE "device_id" = $1`,
  CREATE_USER: `INSERT INTO "user" (id, device_id) VALUES ($1, $2)`,
  UPDATE_USER_LOGIN: `UPDATE "user" SET "last_login" = CURRENT_TIMESTAMP WHERE "id" = $1`,
  UPDATE_USER_LOCATION: `UPDATE "user" SET "x" = $1, "y" = $2 WHERE "device_id" = $3`,
};
