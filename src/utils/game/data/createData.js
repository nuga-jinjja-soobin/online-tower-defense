import { getGameAssets } from '../../../init/loadAssets.js';
import { generateRandomMonsterPath } from '../../../handlers/monster/monsterPath.js';

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
    baseData: {
      hp: baseHp,
      maxHp: baseHp,
    },
    basePosition: {
      x: baseX,
      y: baseY,
    },
    highScore: 0,
  };
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
