import { createResponse } from '../response/createResponse.js';
import { ErrorCodes } from './errorCodes.js';

export const handleError = (socket, error, data) => {
  let responseCode;
  let message;
  if (error.code) {
    responseCode = error.code;
    message = error.message;
    console.error(`에러코드: ${error.code}, 메세지: ${error.message}`);
  } else {
    responseCode = ErrorCodes.SOCKET_ERROR;
    message = error.message;
    console.error(`일반에러: ${error.message}`);
  }

  if (!data) {
    return;
  }
  
  const responsePacket = createResponse(data.packetType, data.failPayloadData, socket.sequence);
  socket.write(responsePacket);
};
