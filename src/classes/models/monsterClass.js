export class Monster {
  constructor(id) {
    this.monsterId = id;
    this.monsterNumber = Math.floor(Math.random() * 5) + 1; // 1 ~ 5 생성
    this.level = 1;
  }

  getMonsterData() {
    return { monsterId: this.monsterId, monsterNumber: this.monsterNumber, level: this.level };
  }
}
