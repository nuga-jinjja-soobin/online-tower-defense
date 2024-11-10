import RedisManager from '../../../classes/managers/redisManager.js';

const client = RedisManager.getClient();

// 게임 세션 저장
export const setGameSession = async (gameId, userIds, state) => {
  await client.set(`game:${gameId}`, JSON.stringify({ userIds, state }));
};

// 게임 세션 조회
export const getGameSession = async (gameId) => {
  const session = await client.get(`game:${gameId}`);
  return session ? JSON.parse(session) : null;
};
