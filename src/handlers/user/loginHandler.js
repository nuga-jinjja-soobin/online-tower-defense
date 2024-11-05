import { createResponse } from '../../utils/response/createResponse.js';
import { packetNames } from '../../protobufs/packetNames.js';
import { PACKET_TYPE } from '../../constants/header.js';

export const loginHandler = async ({ socket, payloadData }) => {
  console.log(`loginHandler 작동 완료.`);
  // 예: 로그인 응답 메시지를 GamePacket에 포함하여 생성

  console.log(payloadData.id, payloadData.password);

  const loginResponsePacket = createResponse(PACKET_TYPE.LOGIN_RESPONSE, 'auth.S2CLoginResponse', {
    success: true,
    message: 'Regist successful',
    token: '123412412315',
    failCode: 0,
  });

  // 소켓에 작성
  socket.write(loginResponsePacket);
};
