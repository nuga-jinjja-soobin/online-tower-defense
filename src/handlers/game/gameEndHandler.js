import { removeGameSession } from '../../sessions/gameSession.js';
import { getUserBySocket } from '../../sessions/userSessions.js';
import { getGameSession } from '../../sessions/gameSession.js';
import DatabaseManager from '../../classes/managers/databaseManager.js';

export const gameEndHandler = async ({ socket, payload }) => {
  // 게임 끝난 유저를 찾는다.
  const gameEndUser = getUserBySocket(socket);
  if (!gameEndUser) {
    return;
  }

  // 게임 끝난 유저가 참여한 Game을 찾는다.
  const findGame = getGameSession(gameEndUser.gameSessionId);
  if (!findGame) {
    return;
  } else {
    const opponentUser = findGame.findUserExceptMe(gameEndUser.id);
    if (!opponentUser) {
      return;
    }

    DatabaseManager.GetInstance().updateHighScore(
      gameEndUser.id,
      findGame.gameData[gameEndUser.id].score,
    );
    DatabaseManager.GetInstance().updateHighScore(
      opponentUser.id,
      findGame.gameData[opponentUser.id].score,
    );

    removeGameSession(findGame.id);
  }

  gameEndUser.gameSessionId = null;
};
