import { User } from '../classes/models/userClass.js';
import { userSessions } from './sessions.js';

export const addUser = (socket) => {
  const user = new User(socket);
  userSessions.push(user);
  //   console.log(`유저 세션 추가 후 접속한 유저 현황: `, userSessions);
  return user;
};

export const removeUser = (socket) => {
  const index = userSessions.findIndex(user.socket === socket);
  if (index !== -1) {
    return userSessions.splice(index, 1)[0];
  }
};

export const getUserById = (id) => {
  return userSessions.find((user) => user.id === id);
};

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};
