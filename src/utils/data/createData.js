import { getGameAssets } from '../../init/loadAssets.js';
import DatabaseManager from '../../managers/databaseManager.js';

// 데이터 명세에 맞게 객체 생성하는 파일
export const createGameStateData = () => {
  const gameAssets = getGameAssets();

  //   const dbUser = DatabaseManager.GetInstance().findUserByUserId(user.id);

  // 게임 데이터 초기값
  const baseHp = gameAssets.initial.data.baseHp;
  const gold = gameAssets.initial.data.initalGold;
  const baseX = gameAssets.initial.data.basePosition.x;
  const baseY = gameAssets.initial.data.basePosition.y;
  const score = gameAssets.initial.data.score;
  const monsterLevel = gameAssets.initial.data.monsterLevel;
  const monsterPath = [
    [0, 0],
    [1, 2],
    [3, 3],
    [5, 5],
  ];
  const towers = [
    [1, 20, 20],
    [2, 50, 50],
  ];
  const monsters = [
    [1, 1, 1],
    [2, 2, 1],
    [3, 1, 1],
  ];

  // BaseData
  const baseData = {
    hp: baseHp,
    maxHp: baseHp,
  };

  // BasePosition
  const basePosition = {
    x: baseX,
    y: baseY,
  };

  // towers, monsters 를 가져와야함.
  // 내 데이터와 상대

  // GameState 데이터
  const data = {
    gold,
    base: baseData,
    // highScore: dbUser.highScore, // userDB에 있는 highScore
    highScore: 0,
    towers,
    monsters,
    monsterLevel,
    score,
    monsterPath,
    basePosition,
  };

  // 이 GameState 데이터를 게임 세션에 추가할 수 있도록 함.

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

/**
 * int32 gold = 1;
  BaseData base = 2;
  int32 highScore = 3;
  repeated TowerData towers = 4;
  repeated MonsterData monsters = 5;
  int32 monsterLevel = 6;
  int32 score = 7;
  repeated Position monsterPath = 8;
  Position basePosition = 9;
 */

//   message InitialGameState {
//     int32 baseHp = 1;
//     int32 towerCost = 2;
//     int32 initialGold = 3;
//     int32 monsterSpawnInterval = 4;
//   }
