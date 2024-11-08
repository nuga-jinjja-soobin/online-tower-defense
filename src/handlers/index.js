/** 핸들러 매핑을 위한 스크립트 */

import { PACKET_TYPE } from '../constants/header.js';
// import { initialHandler } from './user/initial.handler.js';
import { registHandler } from './user/registHandler.js';
import CustomError from '../utils/errors/customError.js';
import { ErrorCodes } from '../utils/errors/errorCodes.js';
import { loginHandler } from './user/loginHandler.js';

const handlers = {
  [PACKET_TYPE.REGISTER_REQUEST]: {
    handler: registHandler,
    protoType: 'auth.C2SRegisterRequest',
  },
  [PACKET_TYPE.LOGIN_REQUEST]: {
    handler: loginHandler,
    protoType: 'auth.S2CLoginRequest',
  },
};

export const getHandlerByPacketType = (PacketType) => {
  console.log(PacketType);
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
