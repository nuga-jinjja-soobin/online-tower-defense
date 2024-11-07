import { PACKET_TYPE } from '../../constants/header.js';
import { handleError } from '../../utils/errors/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const spawnMonsterHandler = ({ socket, payloadData }) => {
  try {
    const { monsterId, monsterNumber } = payloadData;
    const spawnMonsterPacket = createResponse(
      PACKET_TYPE.SPAWN_MONSTER_RESPONSE,
      'spawnMonsterResponse ',
      {
        monsterId: monsterId,
        monsterNumber: monsterNumber,
      },
    );

    socket.write(spawnMonsterPacket);
  } catch (error) {
    handleError(socket, error);
  }
};
