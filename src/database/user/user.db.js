/** USER_DB 제어 및 조회에 필요한 함수들에 대해 모여진 스크립트 */
import pools from '../../../db/databases.js';
import { v4 as uuidv4 } from 'uuid';
import { toCamelCase } from '../../utils/transform/transformCase.js';
import { SQL_QUERIES } from './user.queries.js';

export const findUserByDeviceId = async (deviceId) => {
  const result = await pools.USER_DB.query(SQL_QUERIES.FIND_USER_BY_DEVICE_ID, [deviceId]);
  return toCamelCase(result.rows[0]);
};

export const createUser = async (deviceId) => {
  const id = uuidv4();
  await pools.USER_DB.query(SQL_QUERIES.CREATE_USER, [id, deviceId]);
  return { id, deviceId };
};

export const updateUserLogin = async (id) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_LOGIN, [id]);
};

export const updateUserLocation = async (id, x, y) => {
  await pools.USER_DB.query(SQL_QUERIES.UPDATE_USER_LOCATION, [x, y, id]);
};
