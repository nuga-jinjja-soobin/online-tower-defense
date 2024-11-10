// 특정 핸들러 동작 이후 자동으로 후속 작업을 수행하도록 관리하는 매니저
// 핸들러 동작이 끝나면 처리되도록 하고 싶음.. onData => await handler({socket, data}) 이후

import { PACKET_TYPE } from '../../constants/header.js';
import { getGameSession } from '../../sessions/gameSession.js';
import { getUserBySocket } from '../../sessions/userSessions.js';
import { createSyncData } from '../../utils/game/data/createGameData.js';
import { createResponse } from '../../utils/packet/response/createResponse.js';

class PostProcessManager {
  static gInstance = null;
  // 각 packetType에 맞는 후속 처리 유형을 매핑 (예를 들어 1번 후속처리, 2번 후속처리, ... 등)
  packetPostProcessMap = new Map();

  constructor() {}

  static GetInstance() {
    if (this.gInstance === null) {
      this.gInstance = new PostProcessManager();
    }
    return this.gInstance;
  }

  // packetType에 대한 후속처리 유형을 등록
  registerPostProcess(packetType, processType) {
    this.packetPostProcessMap.set(packetType, processType);
  }

  // 후속처리 유형을 가져옴
  getPostProcessType(packetType) {
    return this.packetPostProcessMap.get(packetType);
  }

  // 후속 처리 실행하는 함수
  async executePostProcess(socket, processType, data = null) {
    switch (processType) {
      case 1:
        // 후속처리 유형 1: 상태 동기화 패킷 전송
        const syncNotiData = createSyncData(socket);
        // console.log(`${socket.userId}의 syncNotiData: `, syncNotiData);
        const syncPacket = createResponse(
          PACKET_TYPE.STATE_SYNC_NOTIFICATION,
          syncNotiData,
          socket.sequence,
        );
        socket.write(syncPacket);
        break;
      // 추가 후속 처리 유형 추가 가능함
      case 2:
        // 후속처리 유형 2: 타워 구매 정보 opponentUser에게 패킷 전송
        const user = getUserBySocket(socket);
        const userId = socket.userId;
        const gameSession = getGameSession(user.gameSessionId);
        gameSession.gameData[userId].gold -= gameSession.assets.initial.data.towerCost;
        const opponentUser = gameSession.users.find((user) => user.id !== userId);
        const ResponsePacket = createResponse(
          PACKET_TYPE.ADD_ENEMY_TOWER_NOTIFICATION,
          data,
          opponentUser.socket.sequence,
        );
        opponentUser.socket.write(ResponsePacket);
        break;
      default:
        console.log(`후속처리 유형 ${processType}이 등록되어 있지 않습니다.`);
        break;
    }
  }

  getAllProcess() {
    return;
  }
}

export default PostProcessManager;
