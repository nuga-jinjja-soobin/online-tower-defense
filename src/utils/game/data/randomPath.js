export const generateRandomMonsterPath = () => {
  const path = [];
  let currentX = 0;
  let currentY = Math.floor(Math.random() * 21) + 290; // 290 ~ 310 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)
  path.push({ x: currentX, y: currentY });
  while (currentX < 1300) {
    currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
    // x 좌표에 대한 clamp 처리
    if (currentX > 1300) {
      currentX = 1300;
    }
    currentY += Math.floor(Math.random() * 20) - 10; // -10 ~ 10 범위의 y 변경
    // y 좌표에 대한 clamp 처리
    if (currentY < 260) {
      currentY = 260;
    }
    if (currentY > 340) {
      currentY = 340;
    }
    path.push({ x: currentX, y: currentY });
  }
  return path;
};

export const getRandomPositionNearPath = (path) => {
  const maxDistance = 100;
  // 타워 배치를 위한 몬스터가 지나가는 경로 상에서 maxDistance 범위 내에서 랜덤한 위치를 반환하는 함수!
  const segmentIndex = Math.floor(Math.random() * (path.length - 1));
  const startX = path[segmentIndex].x;
  const startY = path[segmentIndex].y;
  const endX = path[segmentIndex + 1].x;
  const endY = path[segmentIndex + 1].y;
  const t = Math.random();
  const posX = startX + t * (endX - startX);
  const posY = startY + t * (endY - startY);
  const offsetX = (Math.random() - 0.5) * 2 * maxDistance;
  const offsetY = (Math.random() - 0.5) * 2 * maxDistance;
  const x = posX + offsetX;
  const y = posY + offsetY;
  // 타워 생성
  return [x, y];
};
