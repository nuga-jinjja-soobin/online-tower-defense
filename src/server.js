/** 서버 메인 실행 파일 */

import net from 'net';
import initServer from './init/index.js';
import { onConnection } from './events/onConnection.js';
import { config } from './config/config.js';

const server = net.createServer(onConnection);

initServer()
  .then(() => {
    server.listen(config.server.port, config.server.host, () => {
      console.log(`Echo server listening on ${config.server.host}에서 실행중입니다.`);
      console.log(server.address());
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
