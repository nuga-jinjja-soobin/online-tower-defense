export const generateRandomMonsterPath = () => {
  const path = [];
  let currentX = 0;
  let currentY = Math.floor(Math.random() * 21) + 250; // 250 ~ 270 범위의 y 시작 (캔버스 y축 중간쯤에서 시작할 수 있도록 유도)

  path.push({ x: currentX, y: currentY });

  while (currentX < 1920) {
    currentX += Math.floor(Math.random() * 100) + 50; // 50 ~ 150 범위의 x 증가
    // x 좌표에 대한 clamp 처리
    if (currentX > 1920) {
      currentX = 1920;
    }

    currentY += Math.floor(Math.random() * 20) - 10; // -10 ~ 10 범위의 y 변경
    // y 좌표에 대한 clamp 처리
    if (currentY < 0) {
      currentY = 0;
    }
    if (currentY > 1080) {
      currentY = 1080;
    }

    path.push({ x: currentX, y: currentY });
  }

  return path;
};
