import { PACKET_TYPE } from '../../constants/header.js';
import { getGameSession } from '../../sessions/gameSession.js';
import { userSessions } from '../../sessions/sessions.js';
import { getUserBySocket } from '../../sessions/userSessions.js';
import CustomError from '../../utils/errors/customError.js';
import { ErrorCodes } from '../../utils/errors/errorCodes.js';
import { handleError } from '../../utils/errors/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const spawnMonsterHandler = ({ socket, payload }) => {
  try {
    // 유저 검색 (검증 추가 필요)
    const user = getUserBySocket(socket);
    if (!user) {
      throw new CustomError(
        ErrorCodes.USER_NOT_FOUND,
        '유저를 찾을 수 없습니다: spawnMonsterHandler',
        socket.sequence,
      );
    }

    // 유저가 참여한 세션 검색 (검증 추가 필요)
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
  } catch (error) {
    handleError(socket, error);
  }
};

export const monsterDeathNotification = ({ socket, payload }) => {
  try {
    const { mosterId } = payload;
    const user = getUserBySocket(socket);
    const userGameSessionId = user.gameSessionId; // 현재 게임 세션
    const userIds = userSessions // 게임 세션 안에 들어있는 유저들
      .filter((userGameId) => userGameId.gameSessionId === userGameSessionId)
      .map((user) => user.id);
    const responseUser = userIds.find((userId) => userId !== user.id); // 상대 유저

    console.log('======monsterDeathNotification======');
    console.log(payload);
    console.log(payload.mosterId);
    console.log(`현재 게임 세션: ${userGameSessionId}`);
    console.log(`me: ${user.id}`);
    console.log(`enemy: ${responseUser}`);
    console.log('====================================');

    // socket.write('');
  } catch (error) {
    handleError(socket, error);
  }
};

export const enemyMonsterDeathNotification = ({ socket, payload }) => {
  try {
    const user = getUserBySocket(socket);
    const userGameSessionId = user.gameSessionId; // 현재 게임 세션
    const userIds = userSessions // 게임 세션 안에 들어있는 유저들
      .filter((userGameId) => userGameId.gameSessionId === userGameSessionId)
      .map((user) => user.id);
    const responseUser = userIds.find((userId) => userId !== user.id); // 상대 유저

    console.log('===enemyMonsterDeathNotification===');
    console.log(`현재 게임 세션: ${userGameSessionId}`);
    console.log(`me: ${user.id}`);
    console.log(`enemy: ${responseUser}`);
    console.log('===================================');
  } catch (error) {
    handleError(socket, error);
  }
};
