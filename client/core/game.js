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
    document.getElementById("hud").style.setProperty('display', "none");
  }

  placePlayer(players) {
    players.forEach(player => {
      const exist = document.getElementById(player.id);
      if (!exist) {
        const element = document.createElement("div");
        element.innerHTML = player.avatar;
        element.classList.add("player");
        element.setAttribute("id", player.id);
        element.style.gridRowStart = player.position.y;
        element.style.gridColumnStart = player.position.x;
        this.gameBoard.appendChild(element)
      }
    });
  }

  movePlayer(id, position, direction) {
    const element = document.getElementById(id);

    const translateX = element.clientWidth * direction.x;
    const translateY = element.clientHeight * direction.y;
    element.style.setProperty('--translate-x', `${translateX}px`);
    element.style.setProperty('--translate-y', `${translateY}px`);

    element.style.animationName = "movePlayer";
    element.style.animationFillMode = "forwards";
    element.style.animationDuration = "0.125s";

    element.addEventListener('animationend', () => {
      element.style.gridRowStart = position.y;
      element.style.gridColumnStart = position.x;
      element.style.animationName = "none";
    }, { once: true });
  }

  handleKeyPress(sendPlayerMove) {
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "ArrowUp":
          sendPlayerMove({ x: 0, y: -1 });
          break;
        case "ArrowDown":
          sendPlayerMove({ x: 0, y: 1 });
          break;
        case "ArrowLeft":
          sendPlayerMove({ x: -1, y: 0 });
          break;
        case "ArrowRight":
          sendPlayerMove({ x: 1, y: 0 });
          break;
        case " ":
          this.addBomb = true;
          break;
      }
    });
  }
}

