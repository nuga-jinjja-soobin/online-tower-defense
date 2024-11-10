import { config } from '../config/config.js';
import { getHandlerByPacketType } from '../handlers/index.js';
import { handleError } from '../utils/errors/errorHandler.js';
import { packetParser } from '../utils/packet/parser/packetParser.js';
import PostProcessManager from '../classes/managers/processManager.js';
import { validateSequence } from '../utils/socket/sequence.js';
import CustomError from '../utils/errors/customError.js';
import { ErrorCodes } from '../utils/errors/errorCodes.js';

export const onData = (socket) => async (data) => {
  if (!socket) {
    console.error('Socket is undefined or closed.');
    return;
  }

  socket.buffer = Buffer.concat([socket.buffer, data]);

  const totalHeaderLength = config.packet.totalHeaderLength;
  // console.log(socket.buffer);

  while (socket.buffer.length >= totalHeaderLength) {
    // 1. 패킷 타입 길이만큼 버퍼 읽을 위치 지정
    let offset = 0;

    // 2. 패킷 타입 - 핸들러 (2 bytes)
    const packetType = socket.buffer.readUInt16BE(offset);
    offset += config.packet.typeLength; // 2

    // 3. 클라이언트 버전 길이 (1 byte)
    const versionLength = socket.buffer.readUInt8(offset);
    offset += config.packet.versionLength; // 1

    // 4. 클라이언트 버전 (versionLength bytes)
    const version = socket.buffer.subarray(offset, offset + versionLength).toString('utf-8');
    offset += versionLength;
    // 4-1. 버전이 일치하는지 검증
    if (version !== config.client.version) {
      throw new CustomError(
        ErrorCodes.CLIENT_VERSION_MISMATCH,
        '클라이언트 버전이 일치하지 않습니다.',
      );
    }

    // 5. 패킷 시퀀스 (4 bytes)
    // 여기서 시퀀스 검증이 필요함.
    // 현재 소켓의 유저를 유저세션에서 검색하여 sequence 검증 확인
    const sequence = socket.buffer.readUInt32BE(offset);
    offset += config.packet.sequenceLength;
    const isValidSequence = validateSequence(socket, sequence);
    if (!isValidSequence) {
      throw (new CustomError(ErrorCodes.INVALID_SEQUENCE), '패킷이 중복되거나 누락되었습니다.');
    }
    // 6. 페이로드 길이 (4 bytes)
    const payloadLength = socket.buffer.readUInt32BE(offset);
    offset += config.packet.payloadLength;

    if (socket.buffer.length >= payloadLength + totalHeaderLength) {
      // 7. 페이로드 (payloadLength bytes)
      const payloadBuffer = socket.buffer.subarray(offset, offset + payloadLength);

      // console.log(`Packet Type: ${packetType}`);
      // console.log(`Version Length: ${versionLength}`);
      // console.log(`Version: ${version}`);
      // console.log(`Sequence: ${sequence}`);
      // console.log(`Payload Length: ${payloadLength}`);
      // console.log(`payload: `, payloadBuffer);
      try {
        const { payload } = packetParser(payloadBuffer);

        socket.buffer = socket.buffer.subarray(offset + payloadLength);
        console.log(packetType, payload);
        const handler = getHandlerByPacketType(packetType);
        const data = await handler({ socket, payload });

        // 후속 처리 유형 확인 후 실행
        const processType = PostProcessManager.GetInstance().getPostProcessType(packetType);
        if (processType !== undefined) {
          await PostProcessManager.GetInstance().executePostProcess(socket, processType, data);
        }
        break;
      } catch (e) {
        handleError(socket, e);
        break;
      }
    }
  }
};
