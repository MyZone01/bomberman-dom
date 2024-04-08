export default class Player {
  constructor(id, access, nickname, position, avatar) {
    this.id = id;
    this.access = access;
    this.nickname = nickname;
    this.numberOfLife = 3;
    this.position = position;
    this.avatar = avatar;
  }

  isDeath() {
    return this.numberOfLife === 0
  }

  update(gameOver) {
    if ((this.inputDirection.x === 0 && this.inputDirection.y === 0) || gameOver) return;

    const newPositionX = this.position.x + this.inputDirection.x;
    const newPositionY = this.position.y + this.inputDirection.y;

    if (isValidMove(newPositionX - 1, newPositionY - 1)) {
      this.element.style.setProperty('--translate-x', `${this.element.clientWidth * this.inputDirection.x}px`);
      this.element.style.setProperty('--translate-y', `${this.element.clientHeight * this.inputDirection.y}px`);

      this.element.style.animationName = "movePlayer";
      this.element.style.animationFillMode = "forwards";
      this.element.style.animationDuration = "0.125s";

      this.element.addEventListener('animationend', () => {
        this.position.x = newPositionX;
        this.position.y = newPositionY;
        this.element.style.gridRowStart = this.position.y;
        this.element.style.gridColumnStart = this.position.x;
        this.element.style.animationName = "none";
        this.inputDirection = { x: 0, y: 0 };
      }, { once: true });
    } else {
      this.inputDirection = { x: 0, y: 0 };
    }
  }
}
