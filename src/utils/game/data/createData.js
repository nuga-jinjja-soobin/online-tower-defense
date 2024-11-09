import { getGameAssets } from '../../../init/loadAssets.js';
import DatabaseManager from '../../../managers/databaseManager.js';
import { getGameSession } from '../../../sessions/gameSession.js';
import { getUserBySocket } from '../../../sessions/userSessions.js';
import { generateRandomMonsterPath } from './randomPath.js';

// 게임 세션에 유저의 초기 gameData를 세팅하는 함수
export const createUserInitialData = async (gameData, userId) => {
  const user = await DatabaseManager.GetInstance().findUserByUserId(userId);
  const gameAsset = getGameAssets();
  const baseHp = gameAsset.initial.data.baseHp;

  // 초기 타워 및 몬스터 생성 및 배치
  gameData[userId] = {
    monsterPath: generateRandomMonsterPath(),
    towers: gameData[userId].towers,
    monsters: [], // 초기 몬스터 데이터를 담을 배열
    baseHp: baseHp,
    gold: gameAsset.initial.data.initalGold,
    score: gameAsset.initial.data.score,
    monsterLevel: gameAsset.initial.data.monsterLevel,
    highScore: user.highScore,
    base: gameData[userId].base,
  };
  console.log(`${userId}의 초기데이터: `, gameData[userId]);
};

// 사용자의 gameData를 생성하는 함수
export const createUserData = (gameData, userId) => {
  // towers, monsters 각 인스턴스에서 필요한 값만 매핑
  let towersData = [];
  for (let i in gameData[userId].towers) {
    const tower = gameData[userId].towers[i].getTowerData();
    towersData.push(tower);
  }
  let monsterData = [];
  for (let i in gameData[userId].monsters) {
    const monster = gameData[userId].monsters[i].getMonsterData();
    monsterData.push(monster);
  }

  //베이스 데이터 작성
  const baseData = {
    hp: gameData[userId].base.hp,
    maxHp: gameData[userId].base.maxHp,
  };

  const basePosition = {
    x: gameData[userId].base.x,
    y: gameData[userId].base.y,
  };

  const data = {
    gold: gameData[userId].gold,
    base: baseData,
    highScore: gameData[userId].highScore,
    towers: towersData,
    monsters: monsterData,
    monsterLevel: gameData[userId].monsterLevel,
    score: gameData[userId].score,
    monsterPath: gameData[userId].monsterPath,
    basePosition: basePosition,
  };

  return data;
};

export const createInitialGameData = () => {
  const gameAsset = getGameAssets();

  // InitialGameState 데이터
  const data = {
    baseHp: gameAsset.initial.data.baseHp,
    towerCost: gameAsset.initial.data.towerCost,
    initialGold: gameAsset.initial.data.initalGold,
    monsterSpawnInterval: gameAsset.initial.data.monsterSpawnInterval,
  };

  return data;
};

export const createSyncData = (socket) => {
  const user = getUserBySocket(socket);
  const gameSession = getGameSession(user.gameSessionId);
  let towerData = [];
  for (let i in gameSession.gameData[socket.userId].towers) {
    const tower = gameSession.gameData[socket.userId].towers[i].getTowerData();
    towerData.push(tower);
  }
  // console.log(gameSession.gameData[userId].monsters);
  let monsterData = [];
  for (let i in gameSession.gameData[socket.userId].monsters) {
    const monster = gameSession.gameData[socket.userId].monsters[i].getMonsterData();
    monsterData.push(monster);
  }

  const data = {
    userGold: gameSession.gameData[socket.userId].gold,
    baseHp: gameSession.gameData[socket.userId].base.hp,
    monsterLevel: gameSession.gameData[socket.userId].monsterLevel,
    score: gameSession.gameData[socket.userId].score,
    towers: towerData,
    monsters: monsterData,
  };

  return data;
};
