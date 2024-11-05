/** 서버가 실행될 때 세팅되는 로직
 * 1. 에셋 읽어오기
 * 2. 프로토버프 파일을 읽어오기
 * 3. DB 커넥션 풀 연결 확인하기
 */

// import pools from '../db/databases.js';
// import { addGameSession } from '../sessions/game.session.js';
// import { gameSessions } from '../sessions/sessions.js';
// import { testAllConnections } from '../utils/db/testConnection.js';
// import { loadGameAssets } from './assets.js';
import DatabaseManager from '../managers/databaseManager.js';
import { loadProtos } from './loadProtos.js';
import { v4 as uuidv4 } from 'uuid';

const initServer = async () => {
  try {
    await loadProtos();    
    await DatabaseManager.GetInstance().testAllDBConnection();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

export default initServer;
