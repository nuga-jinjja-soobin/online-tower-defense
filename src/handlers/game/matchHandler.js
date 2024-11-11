import { getUserBySocket } from '../../sessions/userSessions.js';
import CustomError from '../../utils/errors/customError.js';
import { ErrorCodes } from '../../utils/errors/errorCodes.js';
import Match from '../../classes/managers/matchingManager.js';
import { createInitialGameData } from '../../utils/game/data/createGameData.js';
import { getGameSession } from '../../sessions/gameSession.js';
import { createResponse } from '../../utils/packet/response/createResponse.js';
import { PACKET_TYPE } from '../../constants/header.js';

export const matchHandler = async ({ socket, payload }) => {
  const sequence = socket.sequence;

  const user = getUserBySocket(socket);
  if (!user) {
    throw new CustomError(ErrorCodes.USER_NOT_FOUND, '세션에서 유저를 찾을 수 없습니다.');
  }

  // 유저를 매칭 상태로 전환
  user.onMatching();

  // 매칭 성공 시 호출될 콜백 함수
  const onMatchSuccess = (response) => {
    const gameSession = getGameSession(response.gameSessionId);
    const initialGameState = createInitialGameData();
    const [playerData, opponentData] = gameSession.getGameData(socket.userId, response.partnerId);

    const S2CMatchStartNotificationResponse = createResponse(
      PACKET_TYPE.MATCH_START_NOTIFICATION,
      {
        initialGameState,
        playerData,
        opponentData,
      },
      sequence,
    );

    socket.write(S2CMatchStartNotificationResponse);
  };

  // 매칭 서버에 유저 접속 및 콜백 등록
  Match.GetInstance().joinedMatchUser(user, onMatchSuccess);
};
