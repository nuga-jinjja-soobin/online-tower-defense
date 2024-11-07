import { MAX_PLAYER_TO_GAME_SESSIONS } from '../../constants/env.js';
import { GAME_STATE } from '../../constants/state.js';
import { createGameStateData } from '../../utils/data/createData.js';

export class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.gameData = {};
    this.state = GAME_STATE.WAITING;
  }

  // 게임 방에 유저 추가 메서드
  // 1. 게임 방에 유저가 추가되는 메서드
  // 2. 유저 추가 후 게임 세션 최대 인원이면 게임이 시작되도록 설정
  addUser(user) {
    this.users.push(user);

    if (this.users.length >= MAX_PLAYER_TO_GAME_SESSIONS) {
      this.startGame();
    }
  }

  // 초기 게임 데이터를 생성하는 메서드
  createInitData() {
    const data = createGameStateData();
    this.gameData[this.users[0].id] = data;
    this.gameData[this.users[1].id] = data;
  }

  // 게임 시작 함수
  // 1. 게임 시작이 되면 게임데이터 초기값을 불러옴
  // 2. 게임에 참가한 각 유저에게 초기 데이터를 제공함
  // 3. 해당 데이터를 gameData에 모두 담아 놓는다.
  startGame() {
    this.state = GAME_STATE.INPROGRESS;
    // 1. 타워 데이터 입력하기
  }
}
