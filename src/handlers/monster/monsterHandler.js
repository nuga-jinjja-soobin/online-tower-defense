import { PACKET_TYPE } from '../../constants/header.js';
import { getGameSession } from '../../sessions/gameSession.js';
import { getUserBySocket } from '../../sessions/userSessions.js';
import CustomError from '../../utils/errors/customError.js';
import { ErrorCodes } from '../../utils/errors/errorCodes.js';
import { handleError } from '../../utils/errors/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

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

export const enemyMonsterDeathNotification = async ({ socket, payload }) => {
  try {
    console.log(`------enemyMonsterDeathNotification 핸들러 작동------`);
    const monsterId = payload.monsterId;
    const socketUser = getUserBySocket(socket);
    if (!socketUser) {
      throw new CustomError(
        ErrorCodes.USER_NOT_FOUND,
        '유저를 찾을 수 없습니다: enemyMonsterDeathNotification',
        socket.sequence,
      );
    }
    const userGameSessionId = socketUser.gameSessionId; // 현재 게임 세션
    if (!userGameSessionId) {
      throw new CustomError(
        ErrorCodes.GAME_NOT_FOUND,
        '게임 세션을 찾을 수 없습니다: enemyMonsterDeathNotification',
        socket.sequence,
      );
    }
    const gameSession = getGameSession(socketUser.gameSessionId);
    gameSession.dieMonsterCheck(socketUser.id, monsterId);
    const opponentUser = gameSession.users.find((user) => user.id !== socketUser.id); // 상대 유저

    // console.log('======monsterDeathNotification======');
    // console.log(`현재 게임 세션: ${userGameSessionId}`);
    // console.log(`me: ${user.id}`);
    // console.log(`enemy: ${responseUser}`);
    // console.log('====================================');

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
