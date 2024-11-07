/** 클라이언트에 응답을 해주기 위한 패킷을 생성해주는 스크립트 */
import { config } from '../../config/config.js';
import { getProtoMessages } from '../../init/loadProtos.js';

export const createResponse = (packetType, payloadMessage, payloadData = {}) => {
  const protoMessages = getProtoMessages();

  const gamePacket = protoMessages.packet.GamePacket;

  const responsePayload = {};

  responsePayload[payloadMessage] = payloadData;
  console.log(`responsePayload: `, responsePayload);

  const payload = gamePacket.encode(responsePayload).finish();
  console.log(`payload: `, payload);

  const type = Buffer.alloc(2);
  type.writeUInt16BE(packetType);

  const versionString = config.client.version;
  const versionBuffer = Buffer.from(versionString, 'utf-8');
  const versionLength = Buffer.alloc(1);
  versionLength.writeUInt8(versionBuffer.length); // 문자열 길이 기록

  const sequence = Buffer.alloc(4);
  sequence.writeUInt32BE(1); // 예시로 시퀀스 번호 0으로 기록
  const dataLength = Buffer.alloc(4);
  dataLength.writeUInt32BE(payload.length);

  return Buffer.concat([type, versionLength, versionBuffer, sequence, dataLength, payload]);
};
