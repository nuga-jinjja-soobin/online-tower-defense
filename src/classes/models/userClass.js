import { USER_STATE } from '../../constants/state.js';

export class User {
  constructor(socket, id) {
    this.socket = socket;
    this.id = id;
    this.gameSessionId = '';
    this.sequence = 0;
    this.state = USER_STATE.STAY; // 게임 매칭중인지 상태 확인을 위한 속성
  }

  joinedGameSession(gameSession) {
    this.gameSessionId = gameSession.id;
    this.state = USER_STATE.INGAME;
  }

  loginedUser(id) {
    this.id = id;
  }

  onMatching() {
    console.log(`${this.id} 가 매칭을 시작합니다.`);
    this.state = USER_STATE.MATCHING;
  }

  incrementSequence() {
    this.sequence++;
  }

  validateSequence(reciveSequence) {
    const expectedSequence = this.sequence + 1;
    if (expectedSequence === reciveSequence) {
      this.sequence = reciveSequence;
      return true;
    }

    // 패킷이 중복되었는지 검증
    else if (reciveSequence < expectedSequence) {
      return false;
    }

    // 패킷이 누락되었는지 검증
    else {
      return false;
    }
  }
}
