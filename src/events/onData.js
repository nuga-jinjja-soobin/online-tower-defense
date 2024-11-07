import { config } from '../config/config.js';
import { getHandlerByPacketType } from '../handlers/index.js';
import { handleError } from '../utils/errors/errorHandler.js';
import { packetParser } from '../utils/parser/packetParser.js';

export const onData = (socket) => async (data) => {
  socket.buffer = Buffer.concat([socket.buffer, data]);

  const totalHeaderLength = config.packet.totalHeaderLength;
  console.log(socket.buffer);

  while (socket.buffer.length >= totalHeaderLength) {
    try {
      const { packetType, payload, offset } = packetParser(socket);

      socket.buffer = socket.buffer.subarray(offset);
      console.log(packetType, payload);
      const handler = getHandlerByPacketType(packetType);
      await handler({ socket, payload });
      break;
    } catch (e) {
      handleError(socket, e);
      break;
    }
  }
};
