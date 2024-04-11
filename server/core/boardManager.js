import { GRID_SIZE } from "../../shared/constants.js";

export default class BoardManager {
  constructor() {
    this.board = [
      ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
      ['B', 'V', 'V', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'V', 'V', 'B'],
      ['B', 'V', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'V', 'B'],
      ['B', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'B'],
      ['B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
      ['B', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'B'],
      ['B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
      ['B', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'B'],
      ['B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
      ['B', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'B'],
      ['B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
      ['B', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'B'],
      ['B', 'V', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'V', 'B'],
      ['B', 'V', 'V', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'V', 'V', 'B'],
      ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B']
    ];

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (this.board[i][j] === 'W' && Math.random() < 0.4) {
          const powerUpTypes = ['X', 'S', 'M'];
          const randomPowerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
          this.board[i][j] += randomPowerUp;
        }
      }
    }
  }

  isValidMove(position) {
    const cell = this.getCell(position);
    const valid = cell === 'V' || cell === 'S' || cell === 'M' || cell === 'X';
    if (!valid) {
      console.log("Invalid move", position, cell);
    }
    return { valid, cellType: cell };;
  }

  setCell(position, value, vag = false) {
    // if (vag) {
    //   this.board[position.y][position.x] = value;
    // }
    // else {
      this.board[position.y - 1][position.x - 1] = value;
    // }
  }

  getCell(position, vag = false) {
    // if (vag) {
    //   return this.board[position.y][position.x];
    // }
    // else {
      return this.board[position.y - 1][position.x - 1];
    // }
  }

  removeWall(position) {
    const cell = this.getCell(position, true);
    if (cell === "W") {
      this.setCell(position, 'V', true);
    } else {
      const powerUp = cell[1];
      this.setCell(position, powerUp, true);
      console.log("remove cell", cell, this.getCell(position, true), this.board[1]);
    }
  }

  makeCellEmpty(position) {
    this.board[position.y - 1][position.x - 1] = 'V';
  }
}
