import { handleError } from '../utils/errors/errorHandler.js';
import CustomError from '../utils/errors/customError.js';

export const onError = (socket) => async (error) => {
  handleError(socket, new CustomError(500, `소켓 오류: ${error}`));
};
