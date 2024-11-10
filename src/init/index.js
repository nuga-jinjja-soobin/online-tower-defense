/** 서버가 실행될 때 세팅되는 로직
 * 1. 에셋 읽어오기
 * 2. 프로토버프 파일을 읽어오기
 * 3. DB 커넥션 풀 연결 확인하기
 */

import DatabaseManager from '../classes/managers/databaseManager.js';
import { loadGameAssets } from './loadAssets.js';
import { loadPacketTypeHandlers } from './loadProcessInitializer.js';
import { loadProtos } from './loadProtos.js';

const initServer = async () => {
  try {
    await loadGameAssets();
    await loadProtos();
    await DatabaseManager.GetInstance().testAllDBConnection();
    await loadPacketTypeHandlers();
    // 더미 유저 생성 함수 구현필요.
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

export default initServer;
