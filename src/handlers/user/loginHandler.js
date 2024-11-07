import { createResponse } from '../../utils/response/createResponse.js';
import { PACKET_TYPE } from '../../constants/header.js';
import DatabaseManager from '../../managers/databaseManager.js';
import { handleError } from '../../utils/errors/errorHandler.js';
import CustomError from '../../utils/errors/customError.js';
import { ErrorCodes } from '../../utils/errors/errorCodes.js';
import { config } from '../../config/config.js';
import JWT from 'jsonwebtoken';
import { addUser, getUserById } from '../../sessions/userSessions.js';

export const loginHandler = async ({ socket, payloadData }) => {
  try {
    console.log(`loginHandler 작동`);

    const { id, password } = payloadData;

    // 동일한 유저가 접속중인지 확인
    const sessionUser = getUserById(id);
    // console.log(sessionUser);
    if (sessionUser) {
      throw new CustomError(
        ErrorCodes.DUPLICATED_USER_CONNECT,
        `${id}의 유저가 이미 접속중입니다.`,
      );
    }

    // 유저 검증
    const user = await DatabaseManager.GetInstance().findUserByUserId(id);
    if (!user) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, `${id}의 유저 데이터가 없습니다.`);
    }
    if (user.password !== password) {
      throw new CustomError(ErrorCodes.USER_NOT_FOUND, `${id}의 비밀번호가 일치하지 않습니다.`);
    }

    // JWT 토큰 생성
    const userJWT = JWT.sign(user, config.jwt.key, { expiresIn: config.jwt.expires });

    // 유저 세션에 해당 유저 추가
    addUser(socket, id);

    // 응답 패킷 생성
    const loginResponsePacket = createResponse(PACKET_TYPE.LOGIN_RESPONSE, 'loginResponse', {
      success: true,
      message: 'Login Success.',
      token: userJWT,
      failCode: 0,
    });

    // 소켓에 작성
    socket.write(loginResponsePacket);
  } catch (e) {
    handleError(socket, e);
  }
};
