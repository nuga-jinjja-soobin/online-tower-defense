import { USER_STATE } from '../../constants/state.js';

export class User {
  constructor(socket, id) {
    this.socket = socket;
    this.id = id;
    this.gameSessionId = '';
    this.state = USER_STATE.STAY;
  }

  loginedUser(id) {
    this.id = id;
  }

  onMatching() {
    this.state = USER_STATE.MATCHING;
  }
}
