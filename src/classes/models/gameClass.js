import { MAX_PLAYER_TO_GAME_SESSIONS } from '../../constants/env.js';
import { GAME_STATE } from '../../constants/state.js';
import { createGameStateData } from '../../utils/data/createData.js';
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
    this.state = GAME_STATE.WAITING;
    this.monsters = []; // 존재 이유 확인 필요
    this.monstersDie = [];
    this.monsterId = 0;
    this.towerId = 0;
    this.towerCount = 3;
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

  // 게임 시작 함수
  // 1. 게임 시작이 되면 게임데이터 초기값을 불러옴
  // 2. 게임에 참가한 각 유저에게 초기 데이터를 제공함
  // 3. 해당 데이터를 gameData에 모두 담아 놓는다.
  startGame() {
    this.state = GAME_STATE.INPROGRESS;
    // 1. 타워 데이터 입력하기
  }

  // 초기 게임 데이터를 생성하는 메서드
  createInitData() {
    const data = createGameStateData();
    this.gameData[this.users[0].id] = data;
    this.gameData[this.users[1].id] = data;
  }

  spawnMonster(socket) {
    const monster = new Monster(this.monsterId++);
    if (!this.gameData[socket].mosters) {
      this.gameData[socket].monsters = [];
    }
    this.monsters.push(monster); // 여기 this.monsters 추가하는 이유

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
    const ResponsePacket = createResponse(
      PACKET_TYPE.ADD_ENEMY_TOWER_NOTIFICATION,
      'addEnemyTowerNotification',
      {
        towerId,
        x,
        y,
      },
    );
    const responseUser = users.find((user) => user.socket !== socket);
    responseUser.socket.write(ResponsePacket);
  }

  //타워 공격 적에게 정보 전송
  enemyTowerAttackNotification(socket, payloadData) {
    const towerId = payloadData.towerId;
    const monsterId = payloadData.monsterId;
    const ResponsePacket = createResponse(
      PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION,
      'enemyTowerAttackNotification',
      {
        towerId,
        monsterId,
      },
    );
    const responseUser = users.find((user) => user.socket !== socket);
    responseUser.socket.write(ResponsePacket);
  }
}
