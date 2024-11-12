import { Game } from '../classes/models/gameClass.js';
import { GAME_STATE } from '../constants/state.js';
import { gameSessions } from './sessions.js';

export const addGameSession = (id) => {
  const gameSession = new Game(id);
  gameSessions.push(gameSession);
  return gameSession;
};

export const removeGameSession = (id) => {
  const index = gameSessions.findIndex((session) => session.id === id);
  if (index !== -1) {
    return gameSessions.splice(index, 1);
  }
};

export const getGameSession = (id) => {
  return gameSessions.find((session) => session.id === id);
};

export const getAllGameSessions = () => {
  return gameSessions;
};

// 게임 시작 전 게임 세션 찾기
export const findWaitingGameSessions = () => {
  return gameSessions.find((session) => session.state === GAME_STATE.WAITING);
};
