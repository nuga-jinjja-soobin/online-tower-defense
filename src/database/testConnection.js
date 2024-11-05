/** 서버가 실행될 때 DB가 실제로 살아있는지 확인을 위한 테스트 쿼리 */
const testDbConnection = async (pool, dbName) => {
  try {
    const result = await pool.query('SELECT 1 + 1 AS solution');
    console.log(`${dbName} 테스트 쿼리 결과: ${result.rows[0].solution}`);
  } catch (e) {
    console.error(`${dbName} 테스트 쿼리 실행 중 오류 발생: ${e}`);
  }
};

/** DB가 여러개가 있으니 모든 DB에 테스트를 보낼 수 있도록 만듦 */
const testAllConnections = async (pools) => {
  await testDbConnection(pools.GAME_DB, 'GAME_DB');
  await testDbConnection(pools.USER_DB, 'USER_DB');
};

export { testDbConnection, testAllConnections };
