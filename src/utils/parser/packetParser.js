/** 패킷을 파싱해주는 스크립트 */
import { config } from '../../config/config.js';
import { getProtoMessages } from '../../init/loadProtos.js';
import CustomError from '../errors/customError.js';
import { ErrorCodes } from '../errors/errorCodes.js';
import { validateSequence } from '../socket/sequence.js';

export const packetParser = (socket) => {
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

  // 7. 페이로드 (payloadLength bytes)
  const payload = socket.buffer.subarray(offset, offset + payloadLength);

  console.log(`Packet Type: ${packetType}`);
  console.log(`Version Length: ${versionLength}`);
  console.log(`Version: ${version}`);
  console.log(`Sequence: ${sequence}`);
  console.log(`Payload Length: ${payloadLength}`);
  console.log(`payload: `, payload);

  // --------------------------------------------------
  // payload의 경우 요청한 패킷 타입에 따라 구조가 다르기 때문에 프로토버퍼로 읽는다.
  // 1. 프로토 메시지 가져오기
  const protoMessages = getProtoMessages();

  // 2. 게임 공통 패킷 구조로 디코딩 (패킷 타입에 맞는 페이로드로 디코딩) 및 검증
  const Packet = protoMessages.packet.GamePacket;

  let payloadData;
  try {
    payloadData = Packet.decode(payload);
  } catch (e) {
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류가 발생했습니다.');
  }
  console.log(`디코딩한 패킷 값: `, payloadData);

  // 3. 게임 공통 패킷 구조가 oneof 형태이기 때문에 프로토버프의 필드값까지 같이 저장되고 있음.
  // 때문에 설정된 필드의 데이터를 추출하는 함수를 구현
  // 설정된 `oneof` 필드명을 가져옴
  for (const key in payloadData) {
    if (payloadData.hasOwnProperty(key) && typeof payloadData[key] === 'object') {
      return {
        packetType,
        payload: payloadData[key],
        offset: offset + payloadLength,
      };
    }
  }
};
