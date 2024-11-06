export class Monster {
  constructor(id) {
    this.id = id;

    this.monsterNum = Math.floor(Math.random() * 10) + 1; // 1 ~ 5 생성
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
