import { v4 as uuidv4 } from 'uuid';
import { addGameSession, findWaitingGameSessions } from '../../sessions/gameSession.js';
import { USER_STATE } from '../../constants/state.js';

class Match {
  static gInstance = null;
  users = [];
  matchCallbacks = new Map();
  matchingLoopRunning = false;

  constructor() {}

  static GetInstance() {
    if (this.gInstance === null) {
      this.gInstance = new Match();
    }
    return this.gInstance;
  }

  joinedMatchUser(user, callback) {
    this.users.push(user);
    this.matchCallbacks.set(user.socket, callback);

    // 유저가 추가되면 매칭 루프를 시작
    if (!this.matchingLoopRunning) {
      this.startMatchingLoop();
    }
  }

  findmatchedUser(user) {
    return this.users.find(
      (matchUser) => matchUser.socket !== user.socket && matchUser.state === USER_STATE.MATCHING,
    );
  }

  // 유저 매칭
  async startMatchingLoop() {
    this.matchingLoopRunning = true;

    while (this.users.length > 0) {
      for (const user of this.users) {
        if (user.state === USER_STATE.MATCHING) {
          const matchedUser = this.findmatchedUser(user);

          if (matchedUser) {
            // 시작 전 게임 세션 확인 및 추가
            let gameSession = findWaitingGameSessions();
            if (!gameSession) {
              const gameId = uuidv4();
              gameSession = addGameSession(gameId);
            }

            user.state = USER_STATE.INGAME;
            matchedUser.state = USER_STATE.INGAME;

            await gameSession.addUser(user);
            await gameSession.addUser(matchedUser);

            const userCallback = this.matchCallbacks.get(user.socket);
            const matchedUserCallback = this.matchCallbacks.get(matchedUser.socket);

            if (userCallback && matchedUserCallback) {
              userCallback({
                message: '매칭 성공!',
                gameSessionId: gameSession.id,
                partnerId: matchedUser.id,
              });
              matchedUserCallback({
                message: '매칭 성공!',
                gameSessionId: gameSession.id,
                partnerId: user.id,
              });
            }

            // 매칭 대기열에서 매칭된 유저들 삭제
            this.users = this.users.filter((u) => u !== user && u !== matchedUser);

            // 매칭성공 콜백함수에 담긴 유저들 삭제
            this.matchCallbacks.delete(user.socket);
            this.matchCallbacks.delete(matchedUser.socket);
          }
        }
        // 매칭돌린 유저의 상태가 MATCHING이 아닌 경우 매칭 대기열에서 삭제
        else {
          this.users = this.users.filter((u) => u !== user);
        }
      }

      // 매칭할 유저가 없다면 루프를 중지
      if (this.users.length === 0) {
        this.matchingLoopRunning = false;
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

export default Match;
