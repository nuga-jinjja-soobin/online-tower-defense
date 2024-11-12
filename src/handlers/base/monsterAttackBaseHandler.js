import { getGameSession } from '../../sessions/gameSession.js';
import { getUserBySocket } from '../../sessions/userSessions.js';
import CustomError from '../../utils/errors/customError.js';
import { ErrorCodes } from '../../utils/errors/errorCodes.js';

export const monsterAttackBaseHandler = async ({ socket, payload }) => {
  const damage = payload.damage;

  try {
    // 게임 클래스 불러오기
    const user = getUserBySocket(socket);
    const gameSession = getGameSession(user.gameSessionId);

    await gameSession.updateBaseHPNotification(socket, damage);
  } catch (error) {
    throw new CustomError(ErrorCodes.HANDLER_ERROR, `핸들러 에러 발생: ${error.message}`);
  }
};
