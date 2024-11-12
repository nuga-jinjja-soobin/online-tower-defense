class Base {
  constructor(x, y, baseHp) {
    this.maxHp = baseHp;
    this.hp = baseHp;
    this.x = x;
    this.y = y;
  }

  hitBase(damage) {
    this.hp -= damage;
  }
}

export default Base;
