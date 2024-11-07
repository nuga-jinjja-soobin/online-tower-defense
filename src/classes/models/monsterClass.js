export class Monster {
  constructor(id) {
    this.monsterId = id;
    this.monsterNumber = Math.floor(Math.random() * 5) + 1; // 1 ~ 5 생성
    this.level = 1;
    this.die = false;
  }

  monsterLevelUp() {
    ++this.level;
  }

  monsterDie() {
    this.die = true;
  }
}
