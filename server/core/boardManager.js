const GRID_SIZE = 17

export default class BoardManager {
  constructor() {
    this.board = [
      ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B'],
      ['B', 'V', 'V', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'V', 'V', 'B'],
      ['B', 'V', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'V', 'B'],
      ['B', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'B'],
      ['B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
      ['B', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'B'],
      ['B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
      ['B', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'B'],
      ['B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
      ['B', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'B'],
      ['B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
      ['B', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'B'],
      ['B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B'],
      ['B', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'B'],
      ['B', 'V', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'W', 'B', 'V', 'B'],
      ['B', 'V', 'V', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'W', 'V', 'V', 'V', 'B'],
      ['B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B', 'B']
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
    return valid;
  }

  setCell(position, value) {
    this.board[position.y - 1][position.x - 1] = value;
  }

  getCell(position) {
    return this.board[position.y - 1][position.x - 1];
  }

  removeWall(position) {
    const cell = this.getCell(position);
    if (cell === "W") {
      this.setCell(position, 'V');
    } else {
      const powerUp = cell[1];
      console.log("remove cell", cell);
      this.setCell(position, powerUp);
    }
    console.log("removeWall", this.board);
  }
}