import RedisManager from '../../../classes/managers/redisManager.js';

const client = RedisManager.getClient();

// 유저 세션 저장
export const setUserSession = async (userId, gameId, socketId) => {
  await client.set(`user:${userId}`, JSON.stringify({ gameId, socketId }));
};

// 유저 세션 조회
export const getUserSession = async (userId) => {
  const session = await client.get(`user:${userId}`);
  return session ? JSON.parse(session) : null;
};
