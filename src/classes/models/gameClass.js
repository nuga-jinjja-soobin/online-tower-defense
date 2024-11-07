import { MAX_PLAYER_TO_GAME_SESSIONS } from '../../constants/env.js';
import { Monster } from './monsterClass.js';
import { generateRandomMonsterPath } from '../../handlers/monster/monsterPath.js';
import { getRandomPositionNearPath } from '../../handlers/tower/towerHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import Tower from './towerClass.js';

export class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.gameData = {};
    this.monsters = [];
    this.monstersDie = [];
    this.monsterId = 0;
    this.towerId = 0;
    this.towerCount = 3;
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

  spawnMonster(socket) {
    const monster = new Monster(this.monsterId++);
    if (!this.gameData[socket].mosters) {
      this.gameData[socket].monsters = [];
    }
    this.monsters.push(monster);

    return monster;
  }

  dieMonsterCheck(monsterId) {
    const dieMonster = this.monsters.find((monster) => monster.id === monsterId);
    dieMonster.monsterDie();
    this.monstersDie.push(dieMonster);
    return dieMonster;
  }

  //타워 추가
  addTower(socket, x, y) {
    const tower = new Tower(x, y, this.towerId);
    this.towerId++;
    if (!this.gameData[socket].towers) {
      this.gameData[socket].towers = [];
    }
    this.gameData[socket].towers.push(tower);

    return tower;
  }

  //몬스터path 생성 및 초기 타워 생성
  addPath(socket) {
    const path = generateRandomMonsterPath();
    this.gameData[socket].paths = [...path];
    for (let i = 0; i < this.towerCount; i++) {
      getRandomPositionNearPath(socket, path);
    }
  }

  //타워 구입 적에게 정보 전송
  addEnemyTowerNotification(socket, x, y, towerId) {
    const towerData = {
      towerId,
      x,
      y,
    };
    const ResponsePacket = createResponse(
      PACKET_TYPE.ADD_ENEMY_TOWER_NOTIFICATION,
      towerData,
      socket.sequence,
    );
    const responseUser = users.find((user) => user.socket !== socket);
    responseUser.socket.write(ResponsePacket);
  }

  //타워 공격 적에게 정보 전송
  enemyTowerAttackNotification(socket, payloadData) {
    const towerId = payloadData.towerId;
    const monsterId = payloadData.monsterId;
    const towerData = {
      towerId,
      monsterId,
    };
    const ResponsePacket = createResponse(
      PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION,
      towerData,
      socket.sequence,
    );
    const responseUser = users.find((user) => user.socket !== socket);
    responseUser.socket.write(ResponsePacket);
  }

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
