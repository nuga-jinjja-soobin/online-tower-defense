/** 클라이언트에 응답을 해주기 위한 패킷을 생성해주는 스크립트 */

import { config } from '../../config/config.js';
import { PACKET_TYPE } from '../../constants/header.js';
import { getProtoMessages } from '../../init/loadProtos.js';

export const createResponse = (responseType, responseTypeMessage, payload = null) => {
  const protoMessages = getProtoMessages();

  const commonPacket = protoMessages.packet.GamePacket;

  const [packageName, message] = responseTypeMessage.split('.');
  // console.log(packageName, message);

  const responsePacket = protoMessages[packageName][message];
  console.log(`responsePacket: ${responsePacket}`);

  const responsePayload = responsePacket.create(payload);
  const encodedPayload = responsePacket.encode(responsePayload).finish();
  console.log(`responsePayload: ${JSON.stringify(responsePayload)}`);
  console.log(`encodedPayload: ${encodedPayload}`);
};

// export const createResponse = (responseType, payload) => {
//   const protoMessages = getProtoMessages();

//   // 1. response 타입에 맞는 메시지 동적으로 가져옴
//   const responseMessage = protoMessages[responseType.split('.')[0]][responseType.split('.')[1]];

//   console.log(responseMessage);

//   if (!responseMessage) {
//     throw new Error();
//   }

//   // 2. response 데이터 생성 및 인코딩
//   const responsePayload = responseMessage.create(payload);
//   const encodedResponse = responseMessage.encode(responsePayload).finish();

//   // 3. GamePacket 생성 및 oneof 필드에 response 세팅
//   const GamePacket = protoMessages.packet.GamePacket;
//   const gamePacketPayload = GamePacket.create({
//     [responseType.split('.')[1]]: responsePayload, // oneof 필드로 response 메시지 설정
//   });

//   // 4. GamePacket을 최종 인코딩
//   return GamePacket.encode(gamePacketPayload).finish();

//   // const buffer = responsePacket.encode(responsePayload).finish();

//   // const packetLength = Buffer.alloc(config.packet.totalLength);
//   // packetLength.writeUint32BE(
//   //   buffer.length + config.packet.totalLength + config.packet.typeLength,
//   //   0,
//   // );
//   // const packetType = Buffer.alloc(config.packet.typeLength);
//   // packetType.writeUInt8(PACKET_TYPE.NORMAL);

//   // return Buffer.concat([packetLength, packetType, buffer]);
// };
