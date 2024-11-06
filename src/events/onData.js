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
      const { packetType, payloadData, offset } = packetParser(socket);

      socket.buffer = socket.buffer.subarray(offset);
      console.log(packetType, payloadData);
      const handler = getHandlerByPacketType(packetType);
      await handler({ socket, payloadData });

      break;
    } catch (e) {
      handleError(socket, e);
      break;
    }
  }
};
