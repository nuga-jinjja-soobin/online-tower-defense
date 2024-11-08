import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

let gameAssets = {};

// path를 찾기 위해서 기본 경로를 찾아야함.
// import.meta.url => 현재 실행되는 곳의 절대경로를 말해줌
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename); // 현재 파일의 이름을 제외한 경로를 저장
const basePath = path.join(__dirname, '../assets'); // 현재 파일의 뒤로 2번 간 뒤 assets 폴더를 찾아준 것

// 파일 읽는 함수
const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.join(basePath, filename), 'utf8', (err, data) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(JSON.parse(data));
    });
  });
};

// Promise.all
// 파일은 비동기 병렬로 읽을 예정!
// 동기적으로 읽으면 읽기 순서를 대기해야하므로 시간이 오래걸림
export const loadGameAssets = async () => {
  try {
    const [initial] = await Promise.all([readFileAsync('initial.json')]);

    gameAssets = { initial };
    return gameAssets;
  } catch (e) {
    throw new Error('Failed to load game assets: ' + e.message);
  }
};

export const getGameAssets = () => {
  return gameAssets;
};
