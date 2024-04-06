export default class Player {
  constructor(id, nickname) {
    this.id = id;
    this.nickname = nickname;
    this.numberOfLife = 3
  }

  isDeath() {
    return this.numberOfLife === 0
  }
}
