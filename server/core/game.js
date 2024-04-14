import BoardManager from "./boardManager.js";
import BombManager from "./bombManager.js";
import PlayerManager from "./playerManager.js";
import TaskScheduler from "./taskScheduler.js";
import Player from "../../shared/models/player.js";
import { BOMB_TIMER, GRID_SIZE } from "../../shared/constants.js";

const playerDefaultPosition = [
  { x: 2, y: 2 },
  { x: GRID_SIZE - 1, y: 2 },
  { x: 2, y: GRID_SIZE - 1 },
  { x: GRID_SIZE - 1, y: GRID_SIZE - 1 }
];

export default class Game {
  constructor() {
    this.numberOfPlayer = 0;
    this.bombManager = new BombManager();
    this.playerManager = new PlayerManager();
    this.boardManager = new BoardManager();

    this.taskScheduler = new TaskScheduler();
  }

  board() {
    return this.boardManager.board
  }

  startGameLoop() {

  }

  addPlayer(access, nickname, avatar) {
    const id = 'player-' + this.numberOfPlayer;
    const position = playerDefaultPosition[this.numberOfPlayer];
    this.numberOfPlayer++;
    const player = new Player(id, access, nickname, position, avatar);
    this.playerManager.addPlayer(player)
    return player;
  }

  movePlayer(access, direction) {
    const player = this.playerManager.getPlayerByAccess(access);

    if (player && !player.isMoving()) {
      let toRemove = false
      if (player.isDeath()) {
        return { id: player.id, position: null, nbrLife: player.numberOfLife, toRemove: false };
      }
      const newPosition = {
        x: player.position.x + direction.x,
        y: player.position.y + direction.y
      }
      const moveResult = this.boardManager.isValidMove(newPosition);
      if (moveResult.valid) {
        const cell = moveResult.cellType;
        player.move(direction, newPosition);
        if (cell == 'S') {
          player.currentBombType = "super"
          this.boardManager.makeCellEmpty(newPosition);
          toRemove = true
        } else if (cell == 'M') {
          if (player.numberOfLife < 3) {
            player.numberOfLife += 1;
            toRemove = true
            this.boardManager.makeCellEmpty(newPosition);
          }
        } else if (cell == 'X') {
          if (player.availableBombs < 3 && player.bombAmount < 3) {
            player.bombAmount += 1
            player.availableBombs += 1
            this.boardManager.makeCellEmpty(newPosition);
            toRemove = true
          }
        }
        return { id: player.id, position: newPosition, nbrLife: player.numberOfLife, toRemove: toRemove };
      }
    }
    return { id: player.id, position: null, nbrLife: player.numberOfLife, toRemove: false };
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
    if (player.isDeath()) {
      return null;
    }
    if (player && player.availableBombs > 0) {
      const bomb = this.bombManager.addBomb(player.position, getBombRadius(player.currentBombType));
      this.boardManager.setCell(player.position, "B", true);
      player.availableBombs--;
      if (player.currentBombType === "manual") {
        this.bombManager.makeManual(bomb.id)
      } else {
        if (player.bombType === "super") {
          bomb.explosionRadius = 2;
        }
        this.taskScheduler.scheduleTask(bomb.id, () => this.explodeBomb(bomb, player, sendExplodeBomb), BOMB_TIMER);
        this.taskScheduler.startTask(bomb.id);
      }
      return { id: bomb.id, position: { x: bomb.x, y: bomb.y } };
    }
    return null;
  }

  explodeBomb(bomb, player, sendExplodeBomb) {
    this.bombManager.removeBomb(bomb.id);
    this.boardManager.setCell({ x: bomb.x, y: bomb.y }, "V", true);
    player.availableBombs = player.bombAmount;

    let keepUpDirection = true;
    let keepDownDirection = true;
    let keepLeftDirection = true;
    let keepRightDirection = true;

    this.playerManager.players.forEach(player => {
      if (player.position.x === bomb.x && player.position.y === bomb.y) {
        bomb.applyDamagedToPlayer(player);
      }
    });

    for (let i = 1; i <= bomb.explosionRadius; i++) {
      if (keepUpDirection) {
        const upPosition = { x: bomb.x, y: bomb.y - i };
        const cell = this.boardManager.getCell(upPosition);
        keepUpDirection = !isDirectionValid(cell); // Up
        this.playerManager.players.forEach(player => {
          if (player.position.x === upPosition.x && player.position.y === upPosition.y) {
            bomb.applyDamagedToPlayer(player);
          }
        });
        if (cell.startsWith("W")) {
          this.boardManager.removeWall(upPosition);
        } else {
          const autoExposedBomb = this.bombManager.getBombIdAtPosition(upPosition);
          if (autoExposedBomb) {
            this.taskScheduler.cancelTask(autoExposedBomb.id);
            this.explodeBomb(autoExposedBomb, player, sendExplodeBomb)
          }
        }
      }
      if (keepDownDirection) {
        const downPosition = { x: bomb.x, y: bomb.y + i };
        const cell = this.boardManager.getCell(downPosition);
        keepDownDirection = !isDirectionValid(cell); // Down
        this.playerManager.players.forEach(player => {
          if (player.position.x === downPosition.x && player.position.y === downPosition.y) {
            bomb.applyDamagedToPlayer(player);
          }
        });
        if (cell.startsWith("W")) {
          this.boardManager.removeWall(downPosition);
        } else {
          const autoExposedBomb = this.bombManager.getBombIdAtPosition(downPosition);
          if (autoExposedBomb) {
            this.taskScheduler.cancelTask(autoExposedBomb.id);
            this.explodeBomb(autoExposedBomb, player, sendExplodeBomb)
          }
        }
      }
      if (keepLeftDirection) {
        const leftPosition = { x: bomb.x - i, y: bomb.y };
        const cell = this.boardManager.getCell(leftPosition);
        keepLeftDirection = !isDirectionValid(cell); // Left
        this.playerManager.players.forEach(player => {
          if (player.position.x === leftPosition.x && player.position.y === leftPosition.y) {
            bomb.applyDamagedToPlayer(player);
          }
        });
        if (cell.startsWith("W")) {
          this.boardManager.removeWall(leftPosition);
        } else {
          const autoExposedBomb = this.bombManager.getBombIdAtPosition(leftPosition);
          if (autoExposedBomb) {
            this.taskScheduler.cancelTask(autoExposedBomb.id);
            this.explodeBomb(autoExposedBomb, player, sendExplodeBomb)
          }
        }
      }
      if (keepRightDirection) {
        const rightPosition = { x: bomb.x + i, y: bomb.y };
        const cell = this.boardManager.getCell(rightPosition);
        keepRightDirection = !isDirectionValid(cell); // Right
        this.playerManager.players.forEach(player => {
          if (player.position.x === rightPosition.x && player.position.y === rightPosition.y) {
            bomb.applyDamagedToPlayer(player);
          }
        });
        if (cell.startsWith("W")) {
          this.boardManager.removeWall(rightPosition);
        } else {
          const autoExposedBomb = this.bombManager.getBombIdAtPosition(rightPosition);
          if (autoExposedBomb) {
            this.taskScheduler.cancelTask(autoExposedBomb.id);
            this.explodeBomb(autoExposedBomb, player, sendExplodeBomb)
          }
        }
      }
    }
    sendExplodeBomb(bomb);
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

export function isDirectionValid(cell) {
  if (cell.startsWith('W')) {
    return false;
  } else if (cell === 'B') {
    return true;
  } else {
    return false
  }
}
