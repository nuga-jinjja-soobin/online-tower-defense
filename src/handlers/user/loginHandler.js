import { createResponse } from '../../utils/response/createResponse.js';
import { PACKET_TYPE } from '../../constants/header.js';
import DatabaseManager from '../../managers/databaseManager.js';
import { handleError } from '../../utils/errors/errorHandler.js';
import CustomError from '../../utils/errors/customError.js';
import { ErrorCodes } from '../../utils/errors/errorCodes.js';
import { config } from '../../config/config.js';
import JWT from 'jsonwebtoken';
import { getUserBySocket } from '../../sessions/userSessions.js';

export const loginHandler = async ({ socket, payloadData }) => {
  try {
    console.log(`loginHandler 작동`);

    const { id, password } = payloadData;

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

    // 세션에 등록된 소켓에 유저 아이디 할당
    const socketUser = getUserBySocket(socket);
    if (!socketUser) {
      throw new CustomError(ErrorCodes.SOCKET_ERROR, `소켓 에러 발생`);
    }
    socketUser.loginedUser(id);
    // console.log(socketUser);

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
