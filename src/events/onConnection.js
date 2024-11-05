/** 서버에 접속하는 이벤트가 발생했을 때 처리하는 로직
 * 1. 연결 수립
 * 2. 연결 수립 후 이벤트에 따른 처리 로직 나열
 * 3. data, end, error 3개로 받을 예정
 */
import { onData } from './onData.js';
import { onEnd } from './onEnd.js';
import { onError } from './onError.js';

export const onConnection = (socket) => {
  console.log(`Client connected from: ${socket.remoteAddress}:${socket.remotePort}`);

  // 각 클라이언트마다 고유의 버퍼를 유지하기 위해 빈 버퍼 생성
  socket.buffer = Buffer.alloc(0);

  socket.on('data', onData(socket));
  socket.on('end', onEnd(socket));
  socket.on('error', onError(socket));
};
