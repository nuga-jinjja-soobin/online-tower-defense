// 각자 서버에서 1vs1 테스트를 하기 위한 더미데이터 생성 파일

import { addUser } from '../sessions/userSessions.js';

export const createDummyData = () => {
  // 유저 한명 추가
  const user = addUser('dummy');
  user.loginedUser('dummy');

  // 더미 유저 매칭 상태로 대기
  user.onMatching();
};
