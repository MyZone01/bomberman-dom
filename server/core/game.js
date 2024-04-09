import BoardManager from "./boardManager.js";
import BombManager from "./bombManager.js";
import PlayerManager from "./playerManager.js";
import Player from "../../shared/models/player.js";

const playerDefaultPosition = [
  { x: 2, y: 2 },
  { x: 16, y: 2 },
  { x: 2, y: 16 },
  { x: 16, y: 16 }
];

export default class Game {
  constructor() {
    this.numberOfPlayer = 0;
    this.bombManager = new BombManager();
    this.playerManager = new PlayerManager();
    this.boardManager = new BoardManager();
  }

  board() {
    return this.boardManager.board
  }

  startGameLoop() {

  }

  explodeBomb(bomb) {
    const radius = getBombRadius(bomb.type);
    // Vérifier les collisions avec les joueurs
    this.playerManager.players.forEach(player => {
      console.log(player);
      //    bomb.x-raduis < player.x < bomb.x+raduis
      if ((player.position.x <= bomb.x + radius && player.position.x >= bomb.x - radius) && (player.position.y <= bomb.y + radius && player.position.y >= bomb.y - radius) && (player.position.x == bomb.x || player.position.y == bomb.y)) {
        player.numberOfLife--;
        bomb.addDamagedPlayer(player)
      }
    });

    return null;
  }

  addPlayer(access, nickname) {
    const id = 'player-' + this.numberOfPlayer;
    const position = playerDefaultPosition[this.numberOfPlayer];
    const avatar = ['😆', '🤢', '😡', '🥶'][this.numberOfPlayer];
    this.numberOfPlayer++;
    const player = new Player(id, access, nickname, position, avatar);
    this.playerManager.addPlayer(player)
    return player;
  }

  movePlayer(access, direction) {
    const player = this.playerManager.getPlayerByAccess(access);

    if (player) {
      const newPosition = {
        x: player.position.x + direction.x,
        y: player.position.y + direction.y
      }
      if (this.boardManager.isValidMove(newPosition)) {
        player.move(direction, newPosition);
        return { id: player.id, position: newPosition };
      }
    }
    return { id: player.id, position: null };
  }

  getPlayerByAccess(access) {
    return this.playerManager.getPlayerByAccess(access);
  }

  players() {
    return this.playerManager.players.map((player, i) => {
      return {
        id: player.id,
        avatar: player.avatar,
        position: player.position
      }
    });
  }

  addBomb(access, sendExplodeBomb) {
    const player = this.playerManager.getPlayerByAccess(access);
    if (player && player.availableBombs > 0) {
      const bomb = this.bombManager.addBomb(player.position, getBombRadius(player.currentBombType));
      this.boardManager.setCell(player.position, "B");
      player.availableBombs--;
      if (player.currentBombType === "manual") {
        this.bombManager.makeManual(bomb.id)
      } else {
        setTimeout(() => {
          this.explodeBomb(bomb)
          sendExplodeBomb(bomb, { x: bomb.x, y: bomb.y });
          this.bombManager.removeBomb(bomb.id);
          this.boardManager.setCell({ x: bomb.x, y: bomb.y }, "V");

          setTimeout(() => {
            console.log("⛔ ⛔ ⛔ ⛔ ⛔ EXPLOSION ⛔ ⛔ ⛔ ⛔ ⛔");
            player.availableBombs = player.bombAmount;

            let keepUpDirection = true;
            let keepDownDirection = true;
            let keepLeftDirection = true;
            let keepRightDirection = true;

            for (let i = 1; i <= bomb.explosionRadius; i++) {
              if (keepUpDirection) {
                const cell = this.boardManager.getCell({ x: bomb.x, y: bomb.y - i });
                keepUpDirection = isWall(cell); // Up
                if (keepUpDirection) {
                  this.boardManager.removeWall({ x: bomb.x, y: bomb.y - i })
                }
              }
              if (keepDownDirection) {
                const cell = this.boardManager.getCell({ x: bomb.x, y: bomb.y + i });
                keepDownDirection = isWall(cell); // Down
                if (keepDownDirection) {
                  this.boardManager.removeWall({ x: bomb.x, y: bomb.y + i })
                }
              }
              if (keepLeftDirection) {
                const cell = this.boardManager.getCell({ x: bomb.x - i, y: bomb.y });
                keepLeftDirection = isWall(cell); // Left
                if (keepLeftDirection) {
                  this.boardManager.removeWall({ x: bomb.x - i, y: bomb.y })
                }
              }
              if (keepRightDirection) {
                const cell = this.boardManager.getCell({ x: bomb.x + i, y: bomb.y });
                keepRightDirection = isWall(cell); // Right
                if (keepRightDirection) {
                  this.boardManager.removeWall({ x: bomb.x + i, y: bomb.y })
                }
              }
            }
          }, 255);
        }, 1500);
      }

      return { id: bomb.id, position: { x: bomb.x, y: bomb.y } };
    }
    return null;
  }
}

function getBombRadius(bombType) {
  switch (bombType) {
    case "simple":
      return 1;
    case "super":
      return 3;
    default:
      return 1;
  }
}

export function isWall(cell) {
  if (cell.startsWith('W')) {
    return true;
  } else if (cell === 'B') {
    return false;
  }
}
