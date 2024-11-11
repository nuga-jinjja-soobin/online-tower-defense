import { PACKET_TYPE } from '../../constants/header.js';
import { getGameSession } from '../../sessions/gameSession.js';
import { getUserBySocket } from '../../sessions/userSessions.js';
import CustomError from '../../utils/errors/customError.js';
import { ErrorCodes } from '../../utils/errors/errorCodes.js';
import { handleError } from '../../utils/errors/errorHandler.js';
import { createResponse } from '../../utils/packet/response/createResponse.js';

export const spawnMonsterHandler = async ({ socket, payload }) => {
  try {
    // 유저 검색
    const user = getUserBySocket(socket);
    if (!user) {
      throw new CustomError(
        ErrorCodes.USER_NOT_FOUND,
        '유저를 찾을 수 없습니다: spawnMonsterHandler',
        socket.sequence,
      );
    }

    // 유저가 참여한 세션 검색
    const gameSession = getGameSession(user.gameSessionId);
    if (!gameSession) {
      throw new CustomError(
        ErrorCodes.GAME_NOT_FOUND,
        '게임 세션을 찾을 수 없습니다: spawnMonsterHandler',
        socket.sequence,
      );
    }

    const monster = gameSession.spawnMonster(socket);

    // 현재 소켓의 몬스터 중 랜덤으로 보내준다.
    const spawnMonsterPacket = createResponse(
      PACKET_TYPE.SPAWN_MONSTER_RESPONSE,
      {
        monsterId: monster.monsterId,
        monsterNumber: monster.monsterNumber,
      },
      socket.sequence,
    );

    socket.write(spawnMonsterPacket);

    gameSession.spawnEnemyMonsterNotification(socket, monster.monsterId, monster.monsterNumber);
  } catch (error) {
    handleError(socket, error);
  }
};
