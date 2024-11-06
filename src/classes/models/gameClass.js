import { MAX_PLAYER_TO_GAME_SESSIONS } from '../../constants/env.js';

export class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.gameData = [];
    this.state = 'waiting';
  }

  // 게임 방에 유저 추가 메서드
  // 1. 게임 방에 유저가 추가되는 메서드
  // 2. 유저 추가 후 게임 세션 최대 인원이면 게임이 시작되도록 설정
  addUser(user) {
    this.users.push(user);

    if (this.users.length === MAX_PLAYER_TO_GAME_SESSIONS) {
      this.startGame();
    }
  }

  spawnMonster() {}

  initialTower() {}
  //수빈님 타워부분// 너무 혼자 다 하시는 거 같아요// 아 타워 데이터요? 코드말고?
  // 도와주세요 타워 데이터 흑흑.. 만들어주세요 네네.

  /**
   * message TowerData {
  int32 towerId = 1;
  float x = 2;
  float y = 3;
}
  위에 메시지 형태대로 game 인스턴스에 위에 데이터가 입력된 towers 가 
  this.gameData 로 넣어질 예정이에요.
   */

  // 네?님님 네? 아 맞다 타워부분 작업하신거 볼 수 있을까요?
  // 게임 시작 함수
  // 1. 게임 시작이 되면 게임데이터 초기값을 불러옴
  // 2. 게임에 참가한 각 유저에게 초기 데이터를 제공함
  // 3. 해당 데이터를 gameData에 모두 담아 놓는다.
  startGame() {
    // 1. 타워 데이터 입력하기
  }
}
