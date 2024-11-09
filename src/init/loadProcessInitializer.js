import { PACKET_TYPE } from '../constants/header.js';
import PostProcessManager from '../classes/managers/processManager.js';

export const loadPacketTypeHandlers = async () => {
  // 상태 동기화가 필요한 패킷 타입 등록
  const syncPacketTypes = [
    PACKET_TYPE.MONSTER_DEATH_NOTIFICATION, // 서버랑 클라에 골드랑 스코어 추가를 위한 상태동기화
    PACKET_TYPE.MONSTER_ATTACK_BASE_REQUEST, // 몬스터가 기지 공격했을 때 기지 체력 갱신을 위한 동기화
  ];

  // 후속 처리 유형을 1로 지정하여 상태 동기화 설정
  syncPacketTypes.forEach((packetType) => {
    PostProcessManager.GetInstance().registerPostProcess(packetType, 1); // 1번 후속 처리로 상태 동기화 설정
  });
};
