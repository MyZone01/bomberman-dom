const GRID_SIZE = 17

export default class Game {
  constructor() {
    this.gameBoard = document.getElementById('game-board')
    this.board = []
  }

  createGameBoard() {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (this.board[i][j] === 'V') continue;

        const cell = document.createElement('div');
        let cellClass = '';
        if (this.board[i][j] === 'B') {
          cellClass = 'block';
        } else {
          cellClass = 'wall';
          if (Math.random() < 0.4) {
            const powerUpTypes = ['X', 'S', 'M'];
            const randomPowerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
            this.board[i][j] = randomPowerUp;
          }
        }

        cell.classList.add(cellClass);
        cell.setAttribute('id', `c-${i + 1}-${j + 1}`);
        cell.style.gridRowStart = i + 1;
        cell.style.gridColumnStart = j + 1;

        fragment.appendChild(cell);
      }
    }

    this.gameBoard.appendChild(fragment);
  }
}

