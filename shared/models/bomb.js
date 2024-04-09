export default class Bomb {
  constructor(x, y, explosionRadius) {
    this.id = Date.now();
    this.x = x;
    this.y = y;
    this.explosionRadius = explosionRadius;
    this.manualBomb = false;
    this.affectedPlayer = [];
  }
  addAffectedPlayer(player) {
    this.affectedPlayer.push(player);
    console.log(this.affectedPlayer);
  }

  // explode() {
  //   const explodeSound = document.getElementById('explodeSound');
  //   explodeSound.play()
  //   this.element.style.animation = "none"

  //   let keepUpDirection = true;
  //   let keepDownDirection = true;
  //   let keepLeftDirection = true;
  //   let keepRightDirection = true;

  //   affectPlayer(this.x, this.y);
  //   // affectEnemies(this.x, this.y);
  //   affectBombs(this.x, this.y);
  //   for (let i = 1; i <= this.explosionRadius; i++) {
  //     if (keepUpDirection) {
  //       keepUpDirection = this.explodeInDirection(this.x, this.y - i); // Up
  //       if (keepUpDirection) {
  //         this.verticalBlast.style.opacity = "1"
  //         this.verticalBlast.style.top = `-${i * 100}%`
  //       }
  //     }
  //     if (keepDownDirection) {
  //       keepDownDirection = this.explodeInDirection(this.x, this.y + i); // Down
  //       if (keepDownDirection) {
  //         this.verticalBlast.style.opacity = "1"
  //         this.verticalBlast.style.bottom = `-${i * 100}%`
  //       }
  //     }
  //     if (keepLeftDirection) {
  //       keepLeftDirection = this.explodeInDirection(this.x - i, this.y); // Left
  //       if (keepLeftDirection) {
  //         this.horizontalBlast.style.opacity = "1"
  //         this.horizontalBlast.style.left = `-${i * 100}%`
  //       }
  //     }
  //     if (keepRightDirection) {
  //       keepRightDirection = this.explodeInDirection(this.x + i, this.y); // Right
  //       if (keepRightDirection) {
  //         this.horizontalBlast.style.opacity = "1"
  //         this.horizontalBlast.style.right = `-${i * 100}%`
  //       }
  //     }
  //   }
  //   return this.damageScore
  // }

  // explodeInDirection(x, y) {
  //   affectPlayer(x, y);
  //   affectBombs(x, y);
  //   // this.damageScore += affectEnemies(x, y) * 50;
  //   const isDestroyWall = destroyWall(x - 1, y - 1);
  //   if (isDestroyWall === 1) {
  //     this.damageScore += 10
  //   }
  //   return isDestroyWall !== 0
  // }
}
