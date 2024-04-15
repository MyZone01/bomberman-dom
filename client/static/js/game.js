const GRID_SIZE = 15

export default class Game {
  constructor() {
    this.initGame = false;
    this.playAccess = "";
    this.currentPlayer = null;
    this.gameBoard = document.getElementById('game-board')
    this.gameOverModal = document.getElementById('game-over')
    this.controller = new AbortController();
  }

  gameOver(gameOverInfos) {
    if (gameOverInfos.result === "win") {
      if (this.currentPlayer.id === gameOverInfos.id) {
        this.showGameOver("💥 CONGRATULATION!")
      } else {
        this.showGameOver(gameOverInfos.nickname + " IS THE WINNER!")
      }
    } else {
      const element = document.getElementById(gameOverInfos.id);
      this.gameBoard.removeChild(element);
      if (this.currentPlayer.id === gameOverInfos.id) {
        this.controller.abort();
        this.showGameOver("💀 LOOSER!")
      } else {
        this.showGameOver(gameOverInfos.nickname + " IS DEAD!")
      }
    }
  }

  showGameOver(text) {
    this.gameOverModal.style.display = "block";
    this.gameOverModal.innerHTML = text
    this.hideGameOverModal = setTimeout(() => this.gameOverModal.innerHTML = "", 3000)
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
          if (board[i][j] !== 'W') {
            cell.setAttribute('data-power', board[i][j].slice(1));
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
        this.gameBoard.appendChild(element);

        const livesElement = document.createElement("span");
        livesElement.classList.add("lives");
        livesElement.innerHTML = "❤️".repeat(3);
        element.appendChild(livesElement);
      }
    });
  }

  movePlayer(id, position, direction, nbrLife, toRemove) {
    if (toRemove == true) {
      const cell = document.getElementById(`c-${position.y}-${position.x}`);
      const powerUp = cell.getAttribute("data-power")
      if (powerUp) {
        cell.remove()
      }
    }
    if (nbrLife) {
      updatePlayerLives(id, nbrLife)
    }
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

  addBomb(bomb) {
    const element = document.createElement("div");
    element.classList.add("bomb");
    element.setAttribute("id", bomb.id);
    element.style.gridRowStart = bomb.position.y;
    element.style.gridColumnStart = bomb.position.x;

    const verticalBlast = document.createElement("div")
    const horizontalBlast = document.createElement("div")
    verticalBlast.classList.add("blast")
    horizontalBlast.classList.add("blast")
    verticalBlast.setAttribute("id", "blast-v-" + bomb.id)
    horizontalBlast.setAttribute("id", "blast-h-" + bomb.id)
    element.appendChild(verticalBlast)
    element.appendChild(horizontalBlast)

    this.gameBoard.appendChild(element);
  }

  explodeBomb(bomb) {
    const element = document.getElementById(bomb.id);
    const verticalBlast = element.querySelector("#blast-v-" + bomb.id)
    const horizontalBlast = element.querySelector("#blast-h-" + bomb.id)
    element.style.animation = "none";

    let keepUpDirection = true;
    let keepDownDirection = true;
    let keepLeftDirection = true;
    let keepRightDirection = true;

    for (let i = 1; i <= bomb.explosionRadius; i++) {
      if (keepUpDirection) {
        keepUpDirection = this.explodeInDirection(bomb.x, bomb.y - i); // Up
        if (keepUpDirection) {
          verticalBlast.style.opacity = "1"
          verticalBlast.style.top = `-${i * 100}%`
        }
      }
      if (keepDownDirection) {
        keepDownDirection = this.explodeInDirection(bomb.x, bomb.y + i); // Down
        if (keepDownDirection) {
          verticalBlast.style.opacity = "1"
          verticalBlast.style.bottom = `-${i * 100}%`
        }
      }
      if (keepLeftDirection) {
        keepLeftDirection = this.explodeInDirection(bomb.x - i, bomb.y); // Left
        if (keepLeftDirection) {
          horizontalBlast.style.opacity = "1"
          horizontalBlast.style.left = `-${i * 100}%`
        }
      }
      if (keepRightDirection) {
        keepRightDirection = this.explodeInDirection(bomb.x + i, bomb.y); // Right
        if (keepRightDirection) {
          horizontalBlast.style.opacity = "1"
          horizontalBlast.style.right = `-${i * 100}%`
        }
      }
    }

    setTimeout(() => {
      this.gameBoard.removeChild(element);
    }, 255);

    if (bomb.damagedPlayer.length > 0) {
      bomb.damagedPlayer.forEach(player => {
        let playerElement = document.getElementById(player.id)
        const blinkInterval = setInterval(() => {
          if (playerElement.style.visibility === "hidden") {
            playerElement.style.visibility = "visible";
          } else {
            playerElement.style.visibility = "hidden";
          }
        }, 200);

        setTimeout(() => {
          clearInterval(blinkInterval);
          playerElement.style.visibility = "visible";
        }, 3000);
        updatePlayerLives(player.id, player.numberOfLife)
      });
    }

  }

  explodeInDirection(x, y) {
    const isDestroyWall = destroyWall(x, y);
    return isDestroyWall !== 0
  }

  handleKeyPress(sendPlayerMove, senAddBomb) {
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
      }
    }, { signal: this.controller.signal });
    window.addEventListener("keyup", (e) => {
      switch (e.key) {
        case " ":
          console.log("key up", e.key);
          senAddBomb();
          break;
      }
    }, { signal: this.controller.signal });
  }
}

export function destroyWall(x, y) {
  const cell = document.getElementById(`c-${y}-${x}`);

  if (cell && cell.classList.contains("wall")) {
    cell.classList.add("explode");
    setTimeout(() => {
      const powerUp = cell.getAttribute("data-power")
      if (powerUp) {
        cell.classList.remove("explode");
        cell.classList.remove("wall");
        cell.classList.add("power");
        cell.innerHTML = powerUp;
      } else {
        cell.remove();
      }
    }, 250);
    return 1;
  } else if (cell && cell.classList.contains("block")) {
    return 0;
  } else {
    return 2;
  }
}

function updatePlayerLives(playerId, lives) {
  const playerElement = document.getElementById(playerId);
  if (playerElement) {
    const livesElement = playerElement.querySelector(".lives");
    livesElement.innerHTML = "❤️".repeat(lives);
  }
}
