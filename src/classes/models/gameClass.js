import { MAX_PLAYER_TO_GAME_SESSIONS } from '../../constants/env.js';
import { GAME_STATE } from '../../constants/state.js';
import { createUserInitialData, createUserData } from '../../utils/game/data/createData.js';
import { Monster } from './monsterClass.js';
import { generateRandomMonsterPath } from '../../utils/game/data/generateRandomMonsterPath.js';
import { getRandomPositionNearPath } from '../../handlers/tower/towerHandler.js';
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
    this.state = GAME_STATE.WAITING;
    this.monstersDie = [];
    this.monsterId = 0;
    this.towerId = 0;
    this.towerCount = 3;
    this.assets = getGameAssets();
    this.state = GAME_STATE.STAY;
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
      const socket = this.users[i].socket;
      this.gameData[socket] = {};
      this.addPath(socket);
      const index = this.gameData[socket].paths.length - 1;
      this.addBase(
        socket,
        this.gameData[socket].paths[index].x,
        this.gameData[socket].paths[index].y,
        this.assets.initial.data.baseHp,
      );
      createUserInitialData(this.gameData, this.users[i].socket);
    }
  }

  getGameData(socket) {
    // 주어진 소켓 ID가 아닌 상대 플레이어 찾기
    const opponentUser = this.users.find((user) => user.socket !== socket);

    // 현재 사용자와 상대방의 데이터를 가져옴
    const userData = createUserData(this.gameData, socket);
    const opponentData = createUserData(this.gameData, opponentUser.socket);

    return [userData, opponentData];
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
    const responseUser = this.users.find((user) => user.socket !== socket);
    const ResponsePacket = createResponse(
      PACKET_TYPE.ADD_ENEMY_TOWER_NOTIFICATION,
      {
        towerId,
        x,
        y,
      },
      responseUser.socket.sequence,
    );
    responseUser.socket.write(ResponsePacket);
  }

  //타워 공격 적에게 정보 전송
  enemyTowerAttackNotification(socket, payloadData) {
    const towerId = payloadData.towerId;
    const monsterId = payloadData.monsterId;
    const responseUser = this.users.find((user) => user.socket !== socket);
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

  addBase(socket, x, y, baseHp) {
    const base = new Base(x, y, baseHp);
    this.gameData[socket].base = base;
    return base;
  }

  updateBaseHPNotification(socket, damage) {
    // 베이스 피격
    console.log('-------------------------------------------------', this.gameData[socket].base);
    this.gameData[socket].base.hitBase(damage);

    // 피격 정보 전송
    const userResponsePacket = createResponse(
      PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION,
      {
        isOpponent: false,
        baseHp: this.gameData[socket].base.hp,
      },
      socket.sequence,
    );
    socket.write(userResponsePacket);

    //적에게 피격 정보 전송
    const enemyUser = this.users.find((user) => user.socket !== socket);
    const enemyUserResponsePacket = createResponse(
      PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION,
      {
        isOpponent: true,
        baseHp: this.gameData[socket].base.hp,
      },
      enemyUser.socket.sequence,
    );
    enemyUser.socket.write(enemyUserResponsePacket);
  }

  endGame(gameEndUser) {
    this.state = GAME_STATE.END;

    // 나를 제외한 상대방을 찾는다.
    const otherUser = findUserExceptMe(gameEndUser.id);
    if (!otherUser) {
      console.log('게임에 참여중인 상대방이 없음');
      return;
    }

    let winnerGameEndResponsePayloadData = { isWin: true };
    let looserGameEndResponsePayloadData = { isWin: false };

    // 나와 상대방에게 게임 끝 패킷을 보낸다.
    const winnerRegisterResponsePacket = createResponse(
      PACKET_TYPE.GAME_OVER_NOTIFICATION,
      winnerGameEndResponsePayloadData,
      gameEndUser.socket.sequence,
    );

    const looserRegisterResponsePacket = createResponse(
      PACKET_TYPE.GAME_OVER_NOTIFICATION,
      looserGameEndResponsePayloadData,
      otherUser.socket.sequence,
    );

    console.log(`winnerGameEndResponsePayloadData ${winnerGameEndResponsePayloadData}`);
    console.log(`looserGameEndResponsePayloadData ${looserGameEndResponsePayloadData}`);

    gameEndUser.socket.write(winnerRegisterResponsePacket);
    otherUser.socket.write(looserRegisterResponsePacket);
  }

  endGame(gameEndUser) {
    this.state = GAME_STATE.END;

    // 나를 제외한 상대방을 찾는다.
    const otherUser = findUserExceptMe(gameEndUser.id);
    if (!otherUser) {
      console.log('게임에 참여중인 상대방이 없음');
      return;
    }

    let winnerGameEndResponsePayloadData = { isWin: true };
    let looserGameEndResponsePayloadData = { isWin: false };

    // 나와 상대방에게 게임 끝 패킷을 보낸다.
    const winnerRegisterResponsePacket = createResponse(
      PACKET_TYPE.GAME_OVER_NOTIFICATION,
      winnerGameEndResponsePayloadData,
      gameEndUser.socket.sequence,
    );

    const looserRegisterResponsePacket = createResponse(
      PACKET_TYPE.GAME_OVER_NOTIFICATION,
      looserGameEndResponsePayloadData,
      otherUser.socket.sequence,
    );

    console.log(`winnerGameEndResponsePayloadData ${winnerGameEndResponsePayloadData}`);
    console.log(`looserGameEndResponsePayloadData ${looserGameEndResponsePayloadData}`);

    gameEndUser.socket.write(winnerRegisterResponsePacket);
    otherUser.socket.write(looserRegisterResponsePacket);
  }
}
