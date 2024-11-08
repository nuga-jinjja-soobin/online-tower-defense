import { PACKET_TYPE } from '../../constants/header.js';
import { getGameSession } from '../../sessions/gameSession.js';
import { getUserBySocket } from '../../sessions/userSessions.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const towerPurchaseHandler = ({ socket, payload }) => {
  console.log(`C2STowerPurchase 작동 완료.`);
  const x = payload.x;
  const y = payload.y;
  console.log(payload);
  // 게임 클래스 불러오기
  const user = getUserBySocket(socket);
  const gameSession = getGameSession(user.gameSessionId);
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
  gameSession.addEnemyTowerNotification(socket, x, y, tower.towerId);
};

export const enemyTowerAttackNotificationHandler = ({ socket, payload }) => {
  // 게임 클래스 불러오기
  const user = getUserBySocket(socket);
  const gameSession = getGameSession(user.gameSessionId);
  // 어택 메서드 실행
  gameSession.enemyTowerAttackNotification(socket, payload);
};

export const getRandomPositionNearPath = (path) => {
  // 게임 클래스 불러오기
  const maxDistance = 100;
  // 타워 배치를 위한 몬스터가 지나가는 경로 상에서 maxDistance 범위 내에서 랜덤한 위치를 반환하는 함수!
  const segmentIndex = Math.floor(Math.random() * (path.length - 1));
  const startX = path[segmentIndex].x;
  const startY = path[segmentIndex].y;
  const endX = path[segmentIndex + 1].x;
  const endY = path[segmentIndex + 1].y;
  const t = Math.random();
  const posX = startX + t * (endX - startX);
  const posY = startY + t * (endY - startY);
  const offsetX = (Math.random() - 0.5) * 2 * maxDistance;
  const offsetY = (Math.random() - 0.5) * 2 * maxDistance;
  const x = posX + offsetX;
  const y = posY + offsetY;
  // 타워 생성
  return [x, y];
};
