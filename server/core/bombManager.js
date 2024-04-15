import Bomb from "../../shared/models/bomb.js";

export default class BombManager {
  constructor() {
    this.bombs = [];
  }

  getBombIdAtPosition(position) {
    const bomb = this.bombs.find(b => b.x === position.x && b.y === position.y);
    return bomb;
  }

  getBombByID(id) {
    return this.bombs.find(b => b.id === id);
  }

  addBomb(position, explosionRadius) {
    const bomb = new Bomb(position.x, position.y, explosionRadius);
    this.bombs.push(bomb);
    return bomb;
  }

  removeBomb(id) {
    this.bombs = this.bombs.filter(b => b.id !== id);
  }
}