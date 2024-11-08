import { config } from '../config/config.js';
import { getHandlerByPacketType } from '../handlers/index.js';
import { handleError } from '../utils/errors/errorHandler.js';
import { packetParser } from '../utils/parser/packetParser.js';
import PostProcessManager from '../classes/managers/processManager.js';

export const onData = (socket) => async (data) => {
  if (!socket) {
    console.error('Socket is undefined or closed.');
    return;
  }

  socket.buffer = Buffer.concat([socket.buffer, data]);

  const totalHeaderLength = config.packet.totalHeaderLength;
  // console.log(socket.buffer);

  while (socket.buffer.length >= totalHeaderLength) {
    try {
      const { packetType, payload, offset } = packetParser(socket);

      socket.buffer = socket.buffer.subarray(offset);
      console.log(packetType, payload);
      const handler = getHandlerByPacketType(packetType);
      await handler({ socket, payload });

      // 후속 처리 유형 확인 후 실행
      const processType = PostProcessManager.GetInstance().getPostProcessType(packetType);
      if (processType !== undefined) {
        await PostProcessManager.GetInstance().executePostProcess(socket, processType);
      }
      break;
    } catch (e) {
      handleError(socket, e);
      break;
    }
  }
};
