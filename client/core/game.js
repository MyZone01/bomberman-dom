const GRID_SIZE = 17

export default class Game {
  constructor() {
    this.playAccess = "";
    this.currentPlayer = null;
    this.gameBoard = document.getElementById('game-board')
  }

  setCurrentPlayer(player) {
    this.currentPlayer = player;
  }

  createGameBoard(board) {
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < GRID_SIZE; i++) {
      for (let j = 0; j < GRID_SIZE; j++) {
        if (board[i][j] === 'V') continue;

        const cell = document.createElement('div');
        let cellClass = '';
        if (board[i][j] === 'B') {
          cellClass = 'block';
        } else {
          cellClass = 'wall';
          if (Math.random() < 0.4) {
            const powerUpTypes = ['X', 'S', 'M'];
            const randomPowerUp = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
            board[i][j] = randomPowerUp;
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
    this.gameBoard.style.setProperty('display', "grid");
    console.log(document.getElementById("hud"));
    document.getElementById("hud").style.setProperty('display', "none");
  }

  placePlayer(players) {
    players.forEach(player => {
      const element = document.createElement("div");
      element.innerHTML = player.avatar;
      element.classList.add("player");
      element.setAttribute("id", player.id);
      element.style.gridRowStart = player.position.y;
      element.style.gridColumnStart = player.position.x;
      this.gameBoard.appendChild(element)
    });
  }
}

