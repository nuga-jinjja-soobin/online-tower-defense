import { HANDLER_IDS } from '../../constants/handlerIds.js';
import { RESPONSE_SUCCESS_CODE } from '../../constants/response.js';
import { handleError } from '../../utils/errors/errorHandler.js';
import { createResponse } from '../../utils/response/createResponse.js';

export const initialHandler = async ({ socket, userId, payload }) => {
  try {
  } catch (e) {
    handleError(socket, e);
  }
};
