import { createResponse } from '../../utils/packet/response/createResponse.js';
import { PACKET_TYPE } from '../../constants/header.js';
import DatabaseManager from '../../classes/managers/databaseManager.js';
import { handleError } from '../../utils/errors/errorHandler.js';
import CustomError from '../../utils/errors/customError.js';
import { ErrorCodes } from '../../utils/errors/errorCodes.js';
import { config } from '../../config/config.js';
import JWT from 'jsonwebtoken';
import { addUser, getUserById } from '../../sessions/userSessions.js';
import bcrypt from 'bcrypt';

export const loginHandler = async ({ socket, payload }) => {
  try {
    const { id, password } = payload;

    // 1. DB 유저 검증
    const user = await DatabaseManager.GetInstance().findUserByUserId(id);
    if (!user) {
      throw new CustomError(
        ErrorCodes.USER_NOT_FOUND,
        `${id}의 유저 데이터가 없습니다.`,
        socket.sequence,
      );
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new CustomError(
        ErrorCodes.USER_NOT_FOUND,
        `${id}의 비밀번호가 일치하지 않습니다.`,
        socket.sequence,
      );
    }

    // 2. 동일한 유저가 접속중인지 확인
    let sessionUser = getUserById(id);
    if (sessionUser) {
      throw new CustomError(
        ErrorCodes.DUPLICATED_USER_CONNECT,
        `${id}의 유저가 이미 접속중입니다.`,
        socket.sequence,
      );
    }

    // 3. 유저 세션에 해당 유저 추가
    sessionUser = addUser(socket, id);
    socket.userId = id;

    // 4. JWT 토큰 생성
    const userJWT = JWT.sign(user, config.jwt.key, { expiresIn: config.jwt.expires });
    socket.token = userJWT;

    const successPayloadData = {
      success: true,
      message: 'Login Success.',
      token: userJWT,
      failCode: 0,
    };

    // 응답 패킷 생성
    const loginResponsePacket = createResponse(
      PACKET_TYPE.LOGIN_RESPONSE,
      successPayloadData,
      socket.sequence,
    );

    // 소켓에 작성
    socket.write(loginResponsePacket);
  } catch (e) {
    const data = {
      failPayloadData: {
        success: false,
        message: 'Login Failed.',
        token: null,
        failCode: 3,
      },
      packetType: PACKET_TYPE.LOGIN_RESPONSE,
    };
    handleError(socket, e, data);
  }
};
