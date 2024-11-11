import net from 'net';
import fs from 'fs';
import path from 'path';
import protobuf from 'protobufjs';
import { PACKET_TYPE } from '../src/constants/header.js';
import { packetNames } from '../src/protobufs/packetNames.js';
import { config } from '../src/config/config.js';
import { fileURLToPath } from 'url';
import { PACKET_MAPS } from '../src/protobufs/packetMaps.js';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);
const protoDir = path.join(__dirname, '../src/protobufs');

// 모든 프로토버프 파일을 읽는 함수
export const GetAllProtoFiles = (dir, fileList = []) => {
  // 1. dir에 있는 모든 경로를 읽음.
  const files = fs.readdirSync(dir);

  // 2. 파일들을 순회
  files.forEach((file) => {
    // 3. 파일경로를 저장
    const filePath = path.join(dir, file);

    // 4. 파일이 폴더라면 재귀하여 안에 폴더를 한번 더 확인
    if (fs.statSync(filePath).isDirectory()) {
      GetAllProtoFiles(filePath, fileList);
    }

    // 5. 일반 파일이라면 .proto 확장자만 찾아서 검색
    else if (path.extname(file) === '.proto') {
      // 6. 해당 파일을 fileList에 추가
      fileList.push(filePath);
    }
  });

  return fileList;
};

const protoFiles = GetAllProtoFiles(protoDir);

const protoMessages = {};

export const LoadProtos = async () => {
  try {
    const root = new protobuf.Root();

    await Promise.all(protoFiles.map((file) => root.load(file)));

    for (const [packageName, types] of Object.entries(packetNames)) {
      protoMessages[packageName] = {};
      for (const [type, typeName] of Object.entries(types)) {
        protoMessages[packageName][type] = root.lookupType(typeName);
      }
    }
  } catch (err) {
    console.error(`Protobuf 파일 로드 중 오류 발생 : ${err}`);
  }
};

LoadProtos();

function CreatePacket(packetType, version, sequence, payload) {
  let versionLength = version.length;

  const typeBuffer = Buffer.alloc(config.packet.typeLength);
  typeBuffer.writeUInt16BE(packetType, 0);

  const versionLengthBuf = Buffer.alloc(config.packet.versionLength);
  versionLengthBuf.writeUInt8(versionLength, 0);

  const versionBuffer = Buffer.from(version, 'utf-8');

  const sequenceBuffer = Buffer.alloc(config.packet.sequenceLength);
  sequenceBuffer.writeUint32BE(sequence, 0);

  const gamePacket = protoMessages.packet.GamePacket;
  const packet = {};
  packet[PACKET_MAPS[packetType]] = payload;
  const payloadBuffer = gamePacket.encode(packet).finish();

  const payloadLengthBuffer = Buffer.alloc(config.packet.payloadLength);
  payloadLengthBuffer.writeUInt32BE(payloadBuffer.length, 0);

  return Buffer.concat([
    typeBuffer,
    versionLengthBuf,
    versionBuffer,
    sequenceBuffer,
    payloadLengthBuffer,
    payloadBuffer,
  ]);
}

let gDummyClientId = 0;
let gFirstName = 0;
let dummyRegisterClientId = 0;
let dummyLoginClientId = 0;

let dummyClients = [];

function randRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function ReConnect() {
  let dummyClientLoginPayload = {
    id: this.fullName,
    password: '123',
  };
}

function ClientDelete(deleteClientId) {
  dummyClients = dummyClients.filter((dummyClient) => dummyClient.clientId !== deleteClientId);
}

class Client {
  constructor(dummyFirstName) {
    this.clientId = gDummyClientId;
    this.dummyFirstName = dummyFirstName;
    this.clientSocket = new net.Socket();
    this.disconnectInterval = null;
    this.sequence = 1;

    gDummyClientId++;
  }

  Connect() {
    this.clientSocket.connect(5555, config.server.host, async () => {
      console.log(`${config.server.host} : 5555 서버와 연결`);

      this.clientSocket.on('data', (data) => {
        //console.log(`${this.dummyFirstName} : [${data}]`);

        let index = 0;

        const packetType = data.readUInt16BE(index);
        index += 2;

        const versionLength = data.readUInt8(index);
        index += 1;

        const version = data.subarray(index, index + versionLength).toString('utf-8');
        index += versionLength;

        const sequence = data.readUInt32BE(index);
        index += 4;

        const payloadLength = data.readUInt32BE(index);
        index += 4;

        const payload = data.subarray(index, index + payloadLength);

        const gamePacket = protoMessages.packet.GamePacket;
        const payloadData = gamePacket.decode(payload);

        switch (packetType) {
          case PACKET_TYPE.LOGIN_RESPONSE:
            this.sequence++;
            setTimeout(() => {
              const matchReqPacket = CreatePacket(
                PACKET_TYPE.MATCH_REQUEST,
                '1.0.0',
                this.sequence,
                {},
              );
              this.clientSocket.write(matchReqPacket);
            }, 2000);
            break;
          case PACKET_TYPE.MATCH_START_NOTIFICATION:
            console.log(`${this.fullName} 게임 시작`);

            // 몬스터 스폰
            setInterval(() => {
              this.sequence++;
              //console.log("몬스터 스폰 전송", this.sequence);

              const monsterSpwanPacket = CreatePacket(
                PACKET_TYPE.SPAWN_MONSTER_REQUEST,
                '1.0.0',
                this.sequence,
                {},
              );
              this.clientSocket.write(monsterSpwanPacket);
            }, 500);
            // this.disconnectInterval = setInterval(()=>{
            //     let randomDisconnect = randRange(1,100);
            //     console.log("random", randomDisconnect);
            //     if (randomDisconnect < 30) {
            //         console.log(`${this.fullName} 연결 끊기 시도`);

            //         clearInterval(this.disconnectInterval);

            //         ClientDelete(this.clientId);

            //         this.clientSocket.end();

            //         //ReConnect();
            //     }
            // },500);
            break;
        }
      });
    });
  }

  RegisterStart() {
    if (!this.dummyFirstName) {
      return;
    }

    let dummyclientRegisterPayload = {
      id: `${this.dummyFirstName}_dummyClient_${dummyRegisterClientId} `,
      password: '123',
      email: `${this.dummyFirstName}_dummyClient_${dummyRegisterClientId}@com`,
    };

    dummyRegisterClientId++;

    const dummyRegistPacket = CreatePacket(
      PACKET_TYPE.REGISTER_REQUEST,
      '1.0.0',
      1,
      dummyclientRegisterPayload,
    );
    this.clientSocket.write(dummyRegistPacket);
  }

  LoginStart() {
    if (!this.dummyFirstName) {
      return;
    }

    this.fullName = `${this.dummyFirstName}_dummyClient_${dummyLoginClientId} `;
    let dummyClientLoginPayload = {
      id: this.fullName,
      password: '123',
    };

    dummyLoginClientId++;

    const dummyLoginPacket = CreatePacket(
      PACKET_TYPE.LOGIN_REQUEST,
      '1.0.0',
      1,
      dummyClientLoginPayload,
    );
    this.clientSocket.write(dummyLoginPacket);
  }
}

// 회원가입 진행하고 로그인 해야함
// ex) DummyClientStart(300, true, false, "jung"); // 더미 300개 회원가입 진행
// ex) DummyClientStart(300, false, true, "jung"); // 더미 300개 로그인 진행
// 테스트 안해봄 DummyClientStart(300, true, true, "jung"); // 더미 300개 회원가입 진행 하고, 로그인 진행
//------------------------------------------------
// count : 더미 개수
// isRegister : 회원가입 진행
// isLogin : 로그인 진행
// dummyName : 더미 맨 앞에 붙일 이름
//------------------------------------------------
async function DummyClientStart(count, isRegister, isLogin, dummyName = null) {
  gFirstName = dummyName;

  for (let i = 0; i < count; i++) {
    const dummyClient = new Client(dummyName);
    dummyClient.Connect();

    dummyClients.push(dummyClient);

    if (isRegister === true) {
      dummyClient.RegisterStart();
    }

    await delay(100);

    if (isLogin === true) {
      dummyClient.LoginStart();
    }
  }
}

let isDummyClientRegisterStart = true;

setTimeout(() => {
  if (isDummyClientRegisterStart) {
    DummyClientStart(500, false, true, 'sung');
  }
}, 2000);

setInterval(() => {
  console.log(`${dummyClients.length} 클라 접속 중`);
}, 1000);
