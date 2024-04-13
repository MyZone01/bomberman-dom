export default class Player {
  constructor(id, access, nickname, position, avatar) {
    this.id = id;
    this.access = access;
    this.nickname = nickname;
    this.numberOfLife = 3;
    this.position = position;
    this.inputDirection = { x: 0, y: 0 };
    this.avatar = avatar;
    this.currentBombType = "simple";
    this.bombAmount = 1;
    this.availableBombs = this.bombAmount;
  }

  isDeath() {
    return this.numberOfLife === 0
  }

  move(direction, newPosition) {
    this.inputDirection = direction;
    setTimeout(() => {
      this.position.x = newPosition.x;
      this.position.y = newPosition.y;
      this.stop();
    }, 150)
  }
  stop() {
    this.inputDirection = { x: 0, y: 0 }
  }
  isMoving() {
    return this.inputDirection.x !== 0 || this.inputDirection.y !== 0;
  }
}
