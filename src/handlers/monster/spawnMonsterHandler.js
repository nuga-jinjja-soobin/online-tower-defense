import { PACKET_TYPE } from '../../constants/header.js';
import { getGameSession } from '../../sessions/gameSession.js';
import { getUserBySocket } from '../../sessions/userSessions.js';
import { handleError } from '../../utils/errors/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const spawnMonsterHandler = ({ socket, payload }) => {
  try {
    // 유저 검색 (검증 추가 필요)
    const user = getUserBySocket(socket);

    // 유저가 참여한 세션 검색 (검증 추가 필요)
    const gameSession = getGameSession(user.gameSessionId);

    const monster = gameSession.spawnMonster(socket.userId);

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
  } catch (error) {
    handleError(socket, error);
  }
};
