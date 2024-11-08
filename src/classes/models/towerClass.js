class Tower {
  constructor(x, y, towerId) {
    this.towerId = towerId;
    this.x = x;
    this.y = y;
  }

  getTowerData() {
    return { towerId: this.towerId, x: this.x, y: this.y };
  }
}

export default Tower;
