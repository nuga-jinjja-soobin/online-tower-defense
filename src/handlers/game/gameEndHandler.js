// 1. 게임 끝난 유저를 찾는다.
// 2. 게임 끝난 유저가 참여한 Game을 찾는다.
// 3. 게임에 참여중인 상대방을 찾는다.
// 4. 게임을 끝낸다.
// 5. 게임 끝난 유저와 상대방에게 게임 종료 응답 패킷을 보내준다.

import { removeGameSession } from "../../sessions/gameSession.js";

export const gameEndHandler = async ({ socket, payload }) => {
  console.log('gameEndHandler 작동 완료');

  // 게임 끝난 유저를 찾는다.
  const gameEndUser = getUserBySocket(socket);
  if (!gameEndUser) {
    console.log('게임 끝난 유저를 못 찾음');
    return;
  }

  // 게임 끝난 유저가 참여한 Game을 찾는다.
  const findGame = getGameSession(gameEndUser.gameSessionId);
  if (!findGame) {
    console.log('게임을 못찾음');
    return;
  }

  const opponetUser = findGame.findUserExceptMe(gameEndUser.id);
  if (!opponetUser) {
    console.log('상대방을 못찾음');
    return;
  }

  removeGameSession(gameEndHandler.gameSessionId);

  gameEndUser.gameSessionId = null;
  opponetUser.gameSessionId = null;  
};
