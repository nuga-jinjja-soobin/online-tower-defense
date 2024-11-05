class User {
  constructor(id, sequence) {
    this.id = id;
    this.sequence = sequence;
  }

  incrementSequence() {
    this.sequence++;
  }

  validateSequence(reciveSequence) {
    const expectedSequence = this.sequence + 1;
    if (expectedSequence === reciveSequence) {
      this.sequence = reciveSequence;
      return true;
    }

    // 패킷이 중복되었는지 검증
    else if (reciveSequence < expectedSequence) {
      return false;
    }

    // 패킷이 누락되었는지 검증
    else {
      return false;
    }
  }
}
