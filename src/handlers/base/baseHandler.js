import { getGameSession } from '../../sessions/gameSession.js';
import { getUserBySocket } from '../../sessions/userSessions.js';

export const updateBaseHPNotification = async ({ socket, payload }) => {
  const damage = payload.damage;

  try {
    // 게임 클래스 불러오기
    const user = getUserBySocket(socket);
    const gameSession = getGameSession(user.gameSessionId);

    await gameSession.updateBaseHPNotification(socket, damage);
  } catch (error) {
    console.error(`updateBaseHPNotification ${error}`);
  }
};
