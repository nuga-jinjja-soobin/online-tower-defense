import { getGameSession } from '../../sessions/gameSession.js';
import { getUserBySocket } from '../../sessions/userSessions.js';
import { handleError } from '../../utils/errors/errorHandler.js';
import CustomError from '../../utils/errors/customError.js';
import { ErrorCodes } from '../../utils/errors/errorCodes.js';

export const towerAttackHandler = ({ socket, payload }) => {
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
