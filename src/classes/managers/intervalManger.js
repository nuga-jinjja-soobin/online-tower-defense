// 몬스터 생성 주기 관리를 위한 인터벌 매니저 추가 (몬스터 생성 주기 뿐만 아니라 다른 기능도 포함될 수 있도록 함)
export class IntervalManager {
  constructor() {
    this.intervals = new Map();
  }

  // 게임 세션에서 생성 주기, 상태 동기화 주기 설정
  addGame(game, callback, interval, type) {
    // 위에 맵 객체로 생성해야 할거같음
  }
}
