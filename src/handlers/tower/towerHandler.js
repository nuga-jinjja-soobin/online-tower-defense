import { PACKET_TYPE } from '../../constants/header.js';
import { getGameSession } from '../../sessions/gameSession.js';
import { getUserBySocket } from '../../sessions/userSessions.js';
import { createResponse } from '../../utils/response/createResponse.js';
const loginResponsePacket = createResponse(
  PACKET_TYPE.LOGIN_RESPONSE,
  successPayloadData,
  socket.sequence,
);
export const towerPurchaseHandler = ({ socket, payloadData }) => {
  console.log(`C2STowerPurchase 작동 완료.`);
  const x = payloadData.x;
  const y = payloadData.y;
  // 게임 클래스 불러오기
  const user = getUserBySocket(socket);
  const gameSession = getGameSession(user.gameSessionId);

  // 게임 클래스의 addTower실행 생성된 타워 데이터 반환
  const tower = gameSession.addTower(socket, x, y);
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

export const enemyTowerAttackNotificationHandler = ({ socket, payloadData }) => {
  // 게임 클래스 불러오기
  const user = getUserBySocket(socket);
  const gameSession = getGameSession(user.gameSessionId);

  // 어택 메서드 실행
  gameSession.enemyTowerAttackNotification(socket, payloadData);
};

export const getRandomPositionNearPath = (socket, monsterPath) => {
  // 게임 클래스 불러오기
  const user = getUserBySocket(socket);
  const gameSession = getGameSession(user.gameSessionId);

  const maxDistance = 100;

  // 타워 배치를 위한 몬스터가 지나가는 경로 상에서 maxDistance 범위 내에서 랜덤한 위치를 반환하는 함수!
  const segmentIndex = Math.floor(Math.random() * (monsterPath.length - 1));
  const startX = monsterPath[segmentIndex].x;
  const startY = monsterPath[segmentIndex].y;
  const endX = monsterPath[segmentIndex + 1].x;
  const endY = monsterPath[segmentIndex + 1].y;

  const t = Math.random();
  const posX = startX + t * (endX - startX);
  const posY = startY + t * (endY - startY);

  const offsetX = (Math.random() - 0.5) * 2 * maxDistance;
  const offsetY = (Math.random() - 0.5) * 2 * maxDistance;

  const x = posX + offsetX;
  const y = posY + offsetY;

  // 타워 생성
  gameSession.addTower(socket, x, y);
};
