export default class Player {
  constructor(id, access, nickname, position, avatar) {
    this.id = id;
    this.access = access;
    this.nickname = nickname;
    this.numberOfLife = 3;
    this.position = position;
    this.inputDirection = { x: 0, y: 0 };
    this.avatar = avatar;
  }

  isDeath() {
    return this.numberOfLife === 0
  }

  move(direction, newPosition){
    if (this.inputDirection.x !== 0 || this.inputDirection.y !== 0) return;
    this.inputDirection = direction;
    setTimeout(() => {
      this.position.x = newPosition.x;
      this.position.y = newPosition.y;
      this.stop();
    }, 125);
  }

  stop() {
    this.inputDirection = { x: 0, y: 0 }
  }
}
