import { createResponse } from '../../utils/response/createResponse.js';
import { packetNames } from '../../protobufs/packetNames.js';
import { PACKET_TYPE } from '../../constants/header.js';

export const registHandler = async ({ socket, payloadData }) => {
  console.log(`registHandler 작동 완료.`);
  // 예: 로그인 응답 메시지를 GamePacket에 포함하여 생성
  const loginResponsePacket = createResponse(
    PACKET_TYPE.REGISTER_RESPONSE,
    packetNames.auth.S2CLoginResponse,
    {
      success: true,
      message: 'Login successful',
      GlobalFailCode: 0,
    },
  );

  // 소켓에 작성
  socket.write(loginResponsePacket);
};
