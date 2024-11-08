import { PACKET_TYPE } from '../constants/header.js';
import PostProcessManager from '../classes/managers/processManager.js';

export const loadPacketTypeHandlers = async () => {
  // 상태 동기화가 필요한 패킷 타입 등록
  const syncPacketTypes = [
    PACKET_TYPE.TOWER_PURCHASE_REQUEST,
    PACKET_TYPE.SPAWN_MONSTER_REQUEST,
    PACKET_TYPE.GAME_END_REQUEST,
    PACKET_TYPE.MONSTER_DEATH_NOTIFICATION,
    PACKET_TYPE.MONSTER_ATTACK_BASE_REQUEST,
  ];

  // 후속 처리 유형을 1로 지정하여 상태 동기화 설정
  syncPacketTypes.forEach((packetType) => {
    PostProcessManager.GetInstance().registerPostProcess(packetType, 1); // 1번 후속 처리로 상태 동기화 설정
  });
};
