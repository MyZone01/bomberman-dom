export default class Bomb {
  constructor(x, y, explosionRadius) {
    this.id = Date.now();
    this.x = x;
    this.y = y;
    this.explosionRadius = explosionRadius;
    this.manualBomb = false;
    this.damagedPlayer = [];
  }
  addDamagedPlayer(player) {
    this.damagedPlayer.push(player);
    console.log(this.damagedPlayer);
  }

}
