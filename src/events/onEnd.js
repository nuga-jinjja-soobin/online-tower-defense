import { getUserBySocket } from '../sessions/userSessions.js';
import { getGameSession } from '../sessions/gameSession.js';
import { removeUser } from '../sessions/userSessions.js';
import { USER_STATE } from '../constants/state.js';
import DatabaseManager from '../classes/managers/databaseManager.js';
import { createResponse } from '../utils/packet/response/createResponse.js';
import { PACKET_TYPE } from '../constants/header.js';
import CustomError from '../utils/errors/customError.js';
import { ErrorCodes } from '../utils/errors/errorCodes.js';

// 접속 해제 시 시퀀스
export const onEnd = (socket) => async () => {
  // 서버와 접속이 끊긴 유저를 찾는다.
  const disconnectUser = getUserBySocket(socket);
  if (!disconnectUser) {
    return;
  }

  let falseData = null;

  do {
    // 접속 끊긴 대상의 gameSession이 없다면 나감
    if (disconnectUser.gameSessionId === null) {
      break;
    }

    // 유저가 게임중
    if (disconnectUser.state === USER_STATE.INGAME) {
      // 접속 해제한 유저가 참여한 Game을 찾는다.
      const findGame = getGameSession(disconnectUser.gameSessionId);
      if (!findGame) {
        break;
      }

      // 방에서 접속해제한 유저를 추방
      findGame.gameRemoveUser(disconnectUser.id);

      // 방에 있는 남아있는 상대방을 찾음
      const otherUser = findGame.findUserExceptMe(disconnectUser.id);
      if (!otherUser) {
        break;
      }

      // 연결이 안 끊긴 유저의 승리 처리 결과를 클라에게 알려주기 위해 패킷을 만든다.
      const winnerRegisterResponsePacket = createResponse(
        PACKET_TYPE.GAME_OVER_NOTIFICATION,
        { isWin: true },
        otherUser.socket.sequence,
      );

      otherUser.socket.write(winnerRegisterResponsePacket); // 연결안끊은 유저에게만으로 수정

      try {
        falseData = await DatabaseManager.GetInstance().createGameHistoriesWin(
          otherUser.id, // 승리한 유저
          disconnectUser.id, // 패배한 유저 ( 접속 끊은 유저 )
        );
      } catch (error) {
        throw new CustomError(ErrorCodes.HANDLER_ERROR, `핸들러 에러 발생: ${error.message}`);
      }
    } else {
      // 유저가 게임중이 아님
    }
  } while (0);

  removeUser(socket);
};
