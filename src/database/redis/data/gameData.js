import RedisManager from '../../../classes/managers/redisManager.js';

const client = RedisManager.getClient();

// 유저별 게임 데이터 저장
export const setGameData = async (gameId, userId, gameData) => {
  await client.hset(`gameData:${gameId}`, userId, JSON.stringify(gameData));
};

// 유저별 게임 데이터 조회
export const getGameData = async (gameId, userId) => {
  const data = await client.hget(`gameData:${gameId}`, userId);
  return data ? JSON.parse(data) : null;
};
