import { PACKET_TYPE } from '../../constants/header.js';
import { getGameSession } from '../../sessions/gameSession.js';
import { getUserBySocket } from '../../sessions/userSessions.js';
import CustomError from '../../utils/errors/customError.js';
import { ErrorCodes } from '../../utils/errors/errorCodes.js';
import { handleError } from '../../utils/errors/errorHandler.js';
import { createResponse } from '../../utils/packet/response/createResponse.js';

export const monsterDeathHandler = async ({ socket, payload }) => {
  try {
    const monsterId = payload.monsterId;
    const socketUser = getUserBySocket(socket);
    if (!socketUser) {
      throw new CustomError(
        ErrorCodes.USER_NOT_FOUND,
        '유저를 찾을 수 없습니다: enemyMonsterDeathNotification',
        socket.sequence,
      );
    }
    const userGameSessionId = socketUser.gameSessionId;
    if (!userGameSessionId) {
      throw new CustomError(
        ErrorCodes.GAME_NOT_FOUND,
        '게임 세션을 찾을 수 없습니다: enemyMonsterDeathNotification',
        socket.sequence,
      );
    }
    const gameSession = getGameSession(socketUser.gameSessionId);
    gameSession.dieMonsterCheck(socketUser.id, monsterId);
    const opponentUser = gameSession.users.find((user) => user.id !== socketUser.id);

    const ResponsePacket = createResponse(
      PACKET_TYPE.ENEMY_MONSTER_DEATH_NOTIFICATION,
      { monsterId },
      opponentUser.socket.sequence,
    );

    opponentUser.socket.write(ResponsePacket);
  } catch (error) {
    handleError(socket, error);
  }
};
