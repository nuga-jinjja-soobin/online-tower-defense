import { createResponse } from '../../utils/response/createResponse.js';
import { PACKET_TYPE } from '../../constants/header.js';
import DatabaseManager from '../../managers/databaseManager.js';
import bcrypt from 'bcrypt';

export const registHandler = async ({ socket, payloadData }) => {
  console.log(`registHandler 작동 완료.`);
  // 예: 로그인 응답 메시지를 GamePacket에 포함하여 생성

  console.log('payloadData', payloadData);

  let registerResponsePayloadData = {};

  let hashPassword = await bcrypt.hash(payloadData.password, 10);

  let user = await DatabaseManager.GetInstance().findUser(payloadData.id, payloadData.email);
  if (user === undefined) {
    // 회원가입 진행
    DatabaseManager.GetInstance().createUser(payloadData.id, payloadData.email, hashPassword);

    registerResponsePayloadData.success = true;
    registerResponsePayloadData.message = 'success';
    registerResponsePayloadData.failCode = 0;
  } else {
    // 이미 id값을 가진 유저가 DB에 저장되어 있음 ( 회원가입 실패 )
    registerResponsePayloadData.success = false;
    registerResponsePayloadData.message = 'fail';
    registerResponsePayloadData.failCode = 0;
  }

  // const registerResponsePacket = createResponse(
  //   PACKET_TYPE.REGISTER_RESPONSE,
  //   registerResponsePayloadData,
  // );

  // console.log(`registerResponsePayloadData ${registerResponsePayloadData}`);
  //socket.write(registerResponsePacket);
};
