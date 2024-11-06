import { addUser } from '../../sessions/userSessions.js';

export const initialHandler = async (socket) => {
  // 연결한 해당 소켓을 유저 세션에 추가
  addUser(socket);
};
