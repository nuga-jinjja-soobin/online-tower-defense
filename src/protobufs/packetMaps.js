import { PACKET_TYPE } from '../constants/header.js';

// 각 PACKET_TYPE 객체의 값을 GamePacket 메시지의 oneof payload 필드와 연결하는 매핑 파일
export const PACKET_MAPS = {
  [PACKET_TYPE.REGISTER_REQUEST]: 'registerRequest',
  [PACKET_TYPE.REGISTER_RESPONSE]: 'registerResponse',
  [PACKET_TYPE.LOGIN_REQUEST]: 'loginRequest',
  [PACKET_TYPE.LOGIN_RESPONSE]: 'loginResponse',

  [PACKET_TYPE.MATCH_REQUEST]: 'matchRequest',
  [PACKET_TYPE.MATCH_START_NOTIFICATION]: 'matchStartNotification',

  [PACKET_TYPE.STATE_SYNC_NOTIFICATION]: 'stateSyncNotification',

  [PACKET_TYPE.TOWER_PURCHASE_REQUEST]: 'towerPurchaseRequest',
  [PACKET_TYPE.TOWER_PURCHASE_RESPONSE]: 'towerPurchaseResponse',
  [PACKET_TYPE.ADD_ENEMY_TOWER_NOTIFICATION]: 'addEnemyTowerNotification',

  [PACKET_TYPE.SPAWN_MONSTER_REQUEST]: 'spawnMonsterRequest',
  [PACKET_TYPE.SPAWN_MONSTER_RESPONSE]: 'spawnMonsterResponse',
  [PACKET_TYPE.SPAWN_ENEMY_MONSTER_NOTIFICATION]: 'spawnEnemyMonsterNotification',

  [PACKET_TYPE.TOWER_ATTACK_REQUEST]: 'towerAttackRequest',
  [PACKET_TYPE.ENEMY_TOWER_ATTACK_NOTIFICATION]: 'enemyTowerAttackNotification',
  [PACKET_TYPE.MONSTER_ATTACK_BASE_REQUEST]: 'monsterAttackBaseRequest',

  [PACKET_TYPE.UPDATE_BASE_HP_NOTIFICATION]: 'updateBaseHpNotification',
  [PACKET_TYPE.GAME_OVER_NOTIFICATION]: 'gameOverNotification',

  [PACKET_TYPE.GAME_END_REQUEST]: 'gameEndRequest',

  [PACKET_TYPE.MONSTER_DEATH_NOTIFICATION]: 'monsterDeathNotification',
  [PACKET_TYPE.ENEMY_MONSTER_DEATH_NOTIFICATION]: 'enemyMonsterDeathNotification',
};
