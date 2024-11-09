import { PACKET_TYPE } from '../../constants/header.js';
import { getGameSession } from '../../sessions/gameSession.js';
import { getUserBySocket } from '../../sessions/userSessions.js';
import { handleError } from '../../utils/errors/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const towerPurchaseHandler = ({ socket, payload }) => {
  try {
    console.log(`C2STowerPurchase 작동 완료.`);
    const x = payload.x;
    const y = payload.y;
    // console.log(payload);
    // 게임 클래스 불러오기
    const user = getUserBySocket(socket);
    if (!user) {
      throw new CustomError(
        ErrorCodes.USER_NOT_FOUND,
        '유저를 찾을 수 없습니다: towerPurchaseHandler',
        socket.sequence,
      );
    }
    const gameSession = getGameSession(user.gameSessionId);
    if (!gameSession) {
      throw new CustomError(
        ErrorCodes.GAME_NOT_FOUND,
        '게임 세션을 찾을 수 없습니다: towerPurchaseHandler',
        socket.sequence,
      );
    }
    // 게임 클래스의 addTower실행 생성된 타워 데이터 반환
    const tower = gameSession.addTower(socket.userId, x, y);
    const towerData = {
      towerId: tower.towerId,
    };
    // 타워구매 패킷 작성
    const ResponsePacket = createResponse(
      PACKET_TYPE.TOWER_PURCHASE_RESPONSE,
      towerData,
      socket.sequence,
    );
    // 소켓에 작성
    socket.write(ResponsePacket);
    // 게임클래스 에서 적에게 알리는 메서드 실행
    const postData = {
      towerId: tower.towerId,
      x,
      y,
    };
    return postData;
  } catch (error) {
    handleError(socket, error);
  }
};

export const opponentTowerAttackNotificationHandler = ({ socket, payload }) => {
  try {
    // 게임 클래스 불러오기
    const user = getUserBySocket(socket);
    if (!user) {
      throw new CustomError(
        ErrorCodes.USER_NOT_FOUND,
        '유저를 찾을 수 없습니다: towerPurchaseHandler',
        socket.sequence,
      );
    }
    const gameSession = getGameSession(user.gameSessionId);
    if (!gameSession) {
      throw new CustomError(
        ErrorCodes.GAME_NOT_FOUND,
        '게임 세션을 찾을 수 없습니다: towerPurchaseHandler',
        socket.sequence,
      );
    }
    // 어택 메서드 실행
    gameSession.opponentTowerAttackNotification(socket, payload);
  } catch (error) {
    handleError(socket, error);
  }
};
