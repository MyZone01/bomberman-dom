export default class Bomb {
  constructor(x, y, explosionRadius) {
    this.id = Date.now();
    this.x = x;
    this.y = y;
    this.explosionRadius = explosionRadius;
    this.manualBomb = false;
    this.damagedPlayer = [];
  }

  applyDamagedToPlayer(player) {
    if (this.damagedPlayer.some((p) => p.id === player.id)) {
      return;
    }
    player.numberOfLife--;
    this.damagedPlayer.push({
      id: player.id,
      numberOfLife: player.numberOfLife
    });
  }
}
