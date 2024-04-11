import Bomb from "../../shared/models/bomb.js";

export default class BombManager {
  constructor() {
    this.bombs = [];
  }

  addBomb(position, explosionRadius) {
    const bomb = new Bomb(position.x, position.y, explosionRadius);
    this.bombs.push(bomb);
    return bomb;
  }

  removeBomb(id) {
    this.bombs = this.bombs.filter(b => b.id !== id);
  }

  makeManual(id) {
    this.bombs = this.bombs.map(b => {
      if (b.id === id) {
        b.manualBomb = true;
      }
      return b;
    });
  }
}