import { getGameSession } from '../../sessions/gameSession.js';
import { getUserBySocket } from '../../sessions/userSessions.js';

export const updateBaseHPNotification = ({ socket, payload }) => {
  const damage = payload.damage;

  // 게임 클래스 불러오기
  const user = getUserBySocket(socket);
  const gameSession = getGameSession(user.gameSessionId);

  gameSession.updateBaseHPNotification(socket, damage);
};
