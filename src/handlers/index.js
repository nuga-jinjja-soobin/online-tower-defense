/** 핸들러 매핑을 위한 스크립트 */

import { PACKET_TYPE } from '../constants/header.js';
import { registerHandler } from './user/registerHandler.js';
import CustomError from '../utils/errors/customError.js';
import { ErrorCodes } from '../utils/errors/errorCodes.js';
import { loginHandler } from './user/loginHandler.js';
import { matchHandler } from './game/matchHandler.js';
import { monsterDeathHandler } from './monster/deathMonsterHandler.js';
import { spawnMonsterHandler } from './monster/spawnMonsterHandler.js';
import { gameEndHandler } from './game/gameEndHandler.js';
import { towerAttackHandler } from './tower/towerAttackHandler.js';
import { towerPurchaseHandler } from './tower/towerPurchaseHandler.js';
import { monsterAttackBaseHandler } from './base/monsterAttackBaseHandler.js';

const handlers = {
  [PACKET_TYPE.REGISTER_REQUEST]: {
    handler: registerHandler,
    protoType: 'auth.C2SRegisterRequest',
  },
  [PACKET_TYPE.LOGIN_REQUEST]: {
    handler: loginHandler,
    protoType: 'auth.S2CLoginRequest',
  },
  [PACKET_TYPE.MATCH_REQUEST]: {
    handler: matchHandler,
    protoType: 'match.C2SMatchRequest',
  },
  [PACKET_TYPE.SPAWN_MONSTER_REQUEST]: {
    handler: spawnMonsterHandler,
    protoType: 'combat.S2CSpawnMonsterResponse',
  },
  [PACKET_TYPE.TOWER_PURCHASE_REQUEST]: {
    handler: towerPurchaseHandler,
    protoType: 'combat.C2STowerPurchaseRequest',
  },
  [PACKET_TYPE.TOWER_ATTACK_REQUEST]: {
    handler: towerAttackHandler,
    protoType: 'combat.C2STowerAttackRequest',
  },
  [PACKET_TYPE.GAME_END_REQUEST]: {
    handler: gameEndHandler,
    protoType: 'gameEvent.C2SGameEndRequest',
  },
  [PACKET_TYPE.MONSTER_ATTACK_BASE_REQUEST]: {
    handler: monsterAttackBaseHandler,
    protoType: 'combat.C2SMonsterAttackBaseRequest',
  },
  [PACKET_TYPE.MONSTER_DEATH_NOTIFICATION]: {
    handler: monsterDeathHandler,
    protoType: 'gameEvent.C2SMonsterDeathNotification',
  },
};

export const getHandlerByPacketType = (PacketType) => {
  if (!handlers[PacketType]) {
    throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, '핸들러 아이디를 찾을 수 없습니다.');
  }
  return handlers[PacketType].handler;
};

export const getProtoTypeNameByPacketType = (PacketType) => {
  if (!handlers[PacketType]) {
    throw new CustomError(ErrorCodes.UNKNOWN_PROTOTYPE_NAME, '프로토타입 이름을 찾을 수 없습니다.');
  }
  return handlers[PacketType].protoType;
};
