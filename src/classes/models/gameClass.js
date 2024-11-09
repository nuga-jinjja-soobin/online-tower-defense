import { MAX_PLAYER_TO_GAME_SESSIONS } from '../../constants/env.js';
import { GAME_STATE } from '../../constants/state.js';
import { createUserInitialData, createUserData } from '../../utils/game/data/createData.js';
import { Monster } from './monsterClass.js';
import {
  generateRandomMonsterPath,
  getRandomPositionNearPath,
} from '../../utils/game/data/randomPath.js';
import { createResponse } from '../../utils/response/createResponse.js';
import Tower from './towerClass.js';
import { getGameAssets } from '../../init/loadAssets.js';
import { PACKET_TYPE } from '../../constants/header.js';
import Base from './baseClass.js';

export class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.gameData = {};
    this.monstersDie = [];
    this.monsterId = 0;
    this.towerId = 0;
    this.assets = getGameAssets();
    this.state = GAME_STATE.WAITING;
  }

  // 게임 방에 유저 추가 메서드
  // 1. 게임 방에 유저가 추가되는 메서드
  // 2. 유저 추가 후 게임 세션 최대 인원이면 게임이 시작되도록 설정
  async addUser(user) {
    this.users.push(user);
    user.gameSessionId = this.id;

    if (this.users.length >= MAX_PLAYER_TO_GAME_SESSIONS) {
      await this.startGame();
    }
  }

  gameRemoveUser(id) {
    this.users = this.users.filter((user) => user.id !== id);
  }

  findUserExceptMe(exceptId) {
    const findUser = this.users.find((user) => user.id !== exceptId);
    return findUser;
  }

  gameRemoveUser(id) {
    this.users = this.users.filter((user) => user.id !== id);
  }

  findUserExceptMe(exceptId) {
    const findUser = this.users.find((user) => user.id !== exceptId);
    return findUser;
  }

  // 게임 시작 함수
  // 1. 게임 시작이 되면 게임데이터 초기값을 불러옴
  // 2. 게임에 참가한 각 유저에게 초기 데이터를 제공함
  // 3. 해당 데이터를 gameData에 모두 담아 놓는다.
  async startGame() {
    this.state = GAME_STATE.INPROGRESS;

    // 유저의 초기데이터 설정을 위해 게임 세션에 있는 유저만큼 반복
    for (let i in this.users) {
      const userId = this.users[i].socket.userId;
      this.gameData[userId] = {};
      this.addPath(userId);
      const index = this.gameData[userId].paths.length - 1;
      this.addBase(
        userId,
        this.gameData[userId].paths[index].x,
        this.gameData[userId].paths[index].y,
        this.assets.initial.data.baseHp,
      );
      await createUserInitialData(this.gameData, userId);
    }
  }

  getGameData(userId, partnerId) {
    // 주어진 소켓 ID가 아닌 상대 플레이어 찾기
    // const opponentUser = this.users.find((user) => user.id !== userId);

    // 현재 사용자와 상대방의 데이터를 가져옴
    const userData = createUserData(this.gameData, userId);
    const opponentData = createUserData(this.gameData, partnerId);

    return [userData, opponentData];
  }

  // gameData.userId.monsters에 몬스터 추가
  spawnMonster(socket) {
    const monster = new Monster(this.monsterId);
    this.monsterId++;
    if (!this.gameData[socket.userId].monsters) {
      this.gameData[socket.userId].monsters = [];
    }
    this.gameData[socket.userId].monsters.push(monster);
    return monster;
  }

  // 몬스터 생성 적에게 전송
  spawnEnemyMonsterNotification(socket, monsterId, monsterNumber) {
    const responseUser = this.users.find((user) => user.socket !== socket);
    const ResponsePacket = createResponse(
      PACKET_TYPE.SPAWN_ENEMY_MONSTER_NOTIFICATION,
      {
        monsterId,
        monsterNumber,
      },
      responseUser.socket.sequence,
    );

    responseUser.socket.write(ResponsePacket);
  }

  // 몬스터 사망 및 골드 & 점수 증가
  dieMonsterCheck(userId, monsterId) {
    this.gameData[userId].monsters = this.gameData[userId].monsters.filter((monster) => {
      if (monster.monsterId !== monsterId) {
        return monster;
      } else {
        this.monstersDie.push(monster);
        const monsterData = this.assets.monster.data.find(
          (data) => data.monsterLevel === monster.level,
        );
        this.gameData[userId].gold += monsterData.gold;
        this.gameData[userId].score += monsterData.score;
      }
    });
  }

  // 타워 추가
  addTower(userId, x, y) {
    const tower = new Tower(x, y, this.towerId);
    this.towerId++;
    if (!this.gameData[userId].towers) {
      this.gameData[userId].towers = [];
    }
    this.gameData[userId].towers.push(tower);
    return tower;
  }

  //몬스터path 생성 및 초기 타워 생성
  addPath(userId) {
    const path = generateRandomMonsterPath();
    this.gameData[userId].paths = [...path];
    for (let i = 0; i < this.assets.initial.data.initialTowerCount; i++) {
      const [x, y] = getRandomPositionNearPath(path);
      this.addTower(userId, x, y);
    }
  }

  //타워 공격 적에게 정보 전송
  opponentTowerAttackNotification(socket, payloadData) {
    const userId = socket.userId;
    const towerId = payloadData.towerId;
    const monsterId = payloadData.monsterId;
    const responseUser = this.users.find((user) => user.id !== userId);
    const ResponsePacket = createResponse(
      PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION,
      {
        towerId,
        monsterId,
      },
      responseUser.socket.sequence,
    );
    responseUser.socket.write(ResponsePacket);
  }

  addBase(userId, x, y, baseHp) {
    const base = new Base(x, y, baseHp);
    this.gameData[userId].base = base;
    return base;
  }

  updateBaseHPNotification(socket, damage) {
    const userId = socket.userId;
    // 베이스 피격
    console.log('-------------------------------------------------', this.gameData[userId].base);
    this.gameData[userId].base.hitBase(damage);

    // 피격 정보 전송
    const userResponsePacket = createResponse(
      PACKET_TYPE.UPDATE_BASE_HP_NOTIFICATION,
      {
        isOpponent: false,
        baseHp: this.gameData[userId].base.hp,
      },
      socket.sequence,
    );
    socket.write(userResponsePacket);

    //적에게 피격 정보 전송
    const opponentUser = this.users.find((user) => user.id !== userId);
    const opponentUserResponsePacket = createResponse(
      PACKET_TYPE.UPDATE_BASE_HP_NOTIFICATION,
      {
        isOpponent: true,
        baseHp: this.gameData[userId].base.hp,
      },
      opponentUser.socket.sequence,
    );
    opponentUser.socket.write(opponentUserResponsePacket);

    if (this.gameData[userId].base.hp < 0) {
      const userResponsePacket = createResponse(
        PACKET_TYPE.GAME_OVER_NOTIFICATION,
        {
          isWin: false,
        },
        socket.sequence,
      );
      socket.write(userResponsePacket);
      const opponentUserResponsePacket = createResponse(
        PACKET_TYPE.GAME_OVER_NOTIFICATION,
        {
          isWin: true,
        },
        opponentUser.socket.sequence,
      );
      opponentUser.socket.write(opponentUserResponsePacket);
    }
  }
}
