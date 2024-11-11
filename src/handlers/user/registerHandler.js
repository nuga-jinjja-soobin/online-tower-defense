import { createResponse } from '../../utils/packet/response/createResponse.js';
import { PACKET_TYPE } from '../../constants/header.js';
import DatabaseManager from '../../classes/managers/databaseManager.js';
import bcrypt from 'bcrypt';

export const registerHandler = async ({ socket, payload }) => {
  let registerResponsePayloadData = {};

  // 비밀번호 해시화
  let hashPassword = await bcrypt.hash(payload.password, 10);

  // 유저 검색
  let user = await DatabaseManager.GetInstance().findUser(payload.id, payload.email);

  // 유저가 없다면 회원가입 진행
  if (user === undefined) {
    DatabaseManager.GetInstance().createUser(payload.id, payload.email, hashPassword);

    registerResponsePayloadData.success = true;
    registerResponsePayloadData.message = '회원가입 성공';
    registerResponsePayloadData.failCode = 0;
  } else {
    // 이미 id값을 가진 유저가 DB에 저장되어 있음 ( 회원가입 실패 )
    registerResponsePayloadData.success = false;
    registerResponsePayloadData.message = '이미 존재하는 사용자입니다';
    registerResponsePayloadData.failCode = 1;
  }

  const registerResponsePacket = createResponse(
    PACKET_TYPE.REGISTER_RESPONSE,
    registerResponsePayloadData,
    socket.sequence,
  );

  socket.write(registerResponsePacket);
};
