/** USER_DB 쿼리문 모임 스크립트 */

export const USER_SQL_QUERIES = {
  FIND_USER_BY_USER_ID: `SELECT * FROM users WHERE userId = ?`,

  FIND_USER_BY_EMAIL: `SELECT * FROM users WHERE email = ?`,

  FIND_USER: `SELECT * FROM users WHERE userId = ? OR email = ?`,

  CREATE_USER: `INSERT INTO users (userId, email, password) VALUES (?, ?, ?)`,

  UPDATE_USER_LOGIN: `UPDATE users SET lastLogin = CURRENT_TIMESTAMP WHERE userId = ?`,

  CREATE_GAME_HISTORY_WIN: `INSERT INTO game_histories (winner, loser) VALUES (?, ?)`,

  UPDATE_HIGH_SCORE: `UPDATE users SET highScore = ? WHERE userId = ?`
};
