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
