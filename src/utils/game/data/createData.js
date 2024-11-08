import { getGameAssets } from '../../../init/loadAssets.js';
import { generateRandomMonsterPath } from './generateRandomMonsterPath.js';

// 게임 세션에 유저의 초기 gameData를 세팅하는 함수
export const createUserInitialData = (gameData, userData) => {
  const gameAsset = getGameAssets();
  const baseHp = gameAsset.initial.data.baseHp;
  const baseX = gameAsset.initial.data.basePosition.x;
  const baseY = gameAsset.initial.data.basePosition.y;

  // 초기 타워 및 몬스터 생성 및 배치
  gameData[userData] = {
    monsterPath: generateRandomMonsterPath(),
    towers: gameData[userData].towers,
    monsters: [], // 초기 몬스터 데이터를 담을 배열
    baseHp: baseHp,
    gold: gameAsset.initial.data.initalGold,
    score: gameAsset.initial.data.score,
    monsterLevel: gameAsset.initial.data.monsterLevel,
    highScore: 0,
    base: gameData[userData].base,
  };
};

// 사용자의 gameData를 생성하는 함수
export const createUserData = (gameData, socket) => {
  // towers, monsters 각 인스턴스에서 필요한 값만 매핑
  let towersData = [];
  for (let i in gameData[socket].towers) {
    const towerId = gameData[socket].towers[i].towerId;
    const x = gameData[socket].towers[i].x;
    const y = gameData[socket].towers[i].y;
    towersData.push({ towerId, x, y });
  }
  let monsterData = [];
  for (let i in gameData[socket].monsters) {
    const monsterId = gameData[socket].monsters[i].monsterId;
    const monsterNumber = gameData[socket].monsters[i].monsterNumber;
    const level = gameData[socket].monsters[i].level;
    monsterData.push({ monsterId, monsterNumber, level });
  }

  //베이스 데이터 작성
  const baseData = {
    hp: gameData[socket].base.hp,
    maxHp: gameData[socket].base.maxHp,
  };

  const basePosition = {
    x: gameData[socket].base.x,
    y: gameData[socket].base.y,
  };

  const data = {
    gold: gameData[socket].gold,
    base: baseData,
    highScore: gameData[socket].highScore,
    towers: towersData,
    monsters: monsterData,
    monsterLevel: gameData[socket].monsterLevel,
    score: gameData[socket].score,
    monsterPath: gameData[socket].monsterPath,
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
