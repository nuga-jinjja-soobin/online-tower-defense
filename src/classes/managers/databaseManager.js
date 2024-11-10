import mysql from 'mysql2/promise';
import { config } from '../../config/config.js';
import { formatDate } from '../../utils/dateFormatter.js';
import { USER_SQL_QUERIES } from '../../database/query/user/user.queries.js';

// 싱글턴
class DatabaseManager {
  static gInstance = null;
  pools = {};

  constructor() {
    const { databases } = config;

    this.createPool('USER_DB', databases.USER_DB);
  }

  static GetInstance() {
    if (DatabaseManager.gInstance === null) {
      DatabaseManager.gInstance = new DatabaseManager();
    }

    return DatabaseManager.gInstance;
  }

  createPool(poolName, dbConfig) {
    const pool = mysql.createPool({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.name,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const originalQuery = pool.query;

    pool.query = async (sql, params) => {
      // 쿼리 실행시 로그
      const date = new Date();
      console.log(
        `[${formatDate(date)}] Executing query: ${sql} ${
          params ? `, ${JSON.stringify(params)}` : ``
        }`,
      );

      const result = await originalQuery.call(pool, sql, params);
      return result;
    };

    this.pools[poolName] = pool;
  }

  async testDBConnection(pool, dbName) {
    try {
      const [rows] = await pool.query('SELECT 1 + 1 AS solution');
      console.log(`${dbName} 테스트 쿼리 결과:`, rows[0].solution);
    } catch (error) {
      console.error(`${dbName} 테스트 쿼리 실행 중 오류 발생`, error);
    }
  }

  async testAllDBConnection() {
    this.testDBConnection(this.pools.USER_DB, 'USER_DB');
  }

  async findUserByUserId(id) {
    const [rows] = await this.pools['USER_DB'].query(USER_SQL_QUERIES.FIND_USER_BY_USER_ID, [id]);
    return rows[0];
  }

  async findUserByEmail(email) {
    const [rows] = await this.pools['USER_DB'].query(USER_SQL_QUERIES.FIND_USER_BY_EMAIL, [email]);
    return rows[0];
  }

  async findUser(id, email) {
    const [rows] = await this.pools['USER_DB'].query(USER_SQL_QUERIES.FIND_USER, [id, email]);
    return rows[0];
  }

  async createUser(id, email, password) {
    await this.pools['USER_DB'].query(USER_SQL_QUERIES.CREATE_USER, [id, email, password]);
    return { id, email, password };
  }

  async updateUserLogin(id) {
    await this.pools['USER_DB'].query(USER_SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
  }

  async createGameHistoriesWin(winnerId, loserId) {
    await this.pools['USER_DB'].query(USER_SQL_QUERIES.CREATE_GAME_HISTORY_WIN, [
      winnerId,
      loserId,
    ]);
  }

  async updateHighScore(userId, hishScore) {
    await this.pools['USER_DB'].query(USER_SQL_QUERIES.UPDATE_HIGH_SCORE, [hishScore, userId]);
  }
}

export default DatabaseManager;
