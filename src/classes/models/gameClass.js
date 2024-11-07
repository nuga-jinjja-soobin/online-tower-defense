import { MAX_PLAYER_TO_GAME_SESSIONS } from '../../constants/env.js';
import { GAME_STATE } from '../../constants/state.js';
import { createUserInitialData } from '../../utils/game/data/createData.js';
import { Monster } from './monsterClass.js';
import { generateRandomMonsterPath } from '../../handlers/monster/monsterPath.js';
import { getRandomPositionNearPath } from '../../handlers/tower/towerHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';
import Tower from './towerClass.js';
import { getGameAssets } from '../../init/loadAssets.js';

export class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.gameData = {};
    this.state = GAME_STATE.WAITING;
    this.monstersDie = [];
    this.monsterId = 0;
    this.towerId = 0;
    this.assets = getGameAssets();
  }

  // 게임 방에 유저 추가 메서드
  // 1. 게임 방에 유저가 추가되는 메서드
  // 2. 유저 추가 후 게임 세션 최대 인원이면 게임이 시작되도록 설정
  addUser(user) {
    this.users.push(user);
    user.gameSessionId = this.id;

    if (this.users.length >= MAX_PLAYER_TO_GAME_SESSIONS) {
      this.startGame();
    }
  }

  // 게임 시작 함수
  // 1. 게임 시작이 되면 게임데이터 초기값을 불러옴
  // 2. 게임에 참가한 각 유저에게 초기 데이터를 제공함
  // 3. 해당 데이터를 gameData에 모두 담아 놓는다.
  async startGame() {
    this.state = GAME_STATE.INPROGRESS;

    // 유저의 초기데이터 설정을 위해 게임 세션에 있는 유저만큼 반복
    for (let i in this.users) {
      this.gameData[this.users[i].socket] = {};
      this.addPath(this.users[i].socket);
      createUserInitialData(this.gameData, this.users[i].socket);
    }
  }

  getGameData(socket) {
    // 주어진 소켓 ID가 아닌 상대 플레이어 찾기
    const opponentUser = this.users.find((user) => user.socket !== socket);

    // 사용자의 gameData를 생성하는 함수
    const createUserData = (socket) => {
      // towers, monsters 각 인스턴스에서 필요한 값만 매핑
      let towersData = [];
      for (let i in this.gameData[socket].towers) {
        const towerId = this.gameData[socket].towers[i].towerId;
        const x = this.gameData[socket].towers[i].x;
        const y = this.gameData[socket].towers[i].y;
        towersData.push({ towerId, x, y });
      }
      let monsterData = [];
      for (let i in this.gameData[socket].monsters) {
        const monsterId = this.gameData[socket].monsters[i].monsterId;
        const monsterNumber = this.gameData[socket].monsters[i].monsterNumber;
        const level = this.gameData[socket].monsters[i].level;
        monsterData.push({ monsterId, monsterNumber, level });
      }

      const data = {
        gold: this.gameData[socket].gold,
        base: this.gameData[socket].baseData,
        highScore: this.gameData[socket].highScore,
        towers: towersData,
        monsters: monsterData,
        monsterLevel: this.gameData[socket].monsterLevel,
        score: this.gameData[socket].score,
        monsterPath: this.gameData[socket].monsterPath,
        basePosition: this.gameData[socket].basePosition,
      };

      return data;
    };

    // 현재 사용자와 상대방의 데이터를 가져옴
    const userData = createUserData(socket);
    const opponentData = createUserData(opponentUser);

    return [userData, opponentData];
  }

  // 초기 게임 데이터를 생성하는 메서드
  createInitData() {
    const data = createGameStateData();
    this.gameData[this.users[0].id] = data;
    this.gameData[this.users[1].id] = data;
  }

  // gameData.socket.monsters에 몬스터 추가
  spawnMonster(socket) {
    const monster = new Monster(this.monsterId);
    this.monsterId++;
    if (!this.gameData[socket].monsters) {
      this.gameData[socket].monsters = [];
    }
    this.gameData[socket].monsters.push(monster);
    return monster;
  }

  dieMonsterCheck(monsterId) {
    const dieMonster = this.monsters.find((monster) => monster.id === monsterId);
    dieMonster.monsterDie();
    this.monstersDie.push(dieMonster);
    return dieMonster;
  }

  // 타워 추가
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
    for (let i = 0; i < this.assets.initial.data.initialTowerCount; i++) {
      const [x, y] = getRandomPositionNearPath(path);
      this.addTower(socket, x, y);
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
