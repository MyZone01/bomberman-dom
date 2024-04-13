const GRID_SIZE = 17

export default class Game {
  constructor() {
    this.isBoardCreated = false;
    this.playAccess = "";
    this.currentPlayer = null;
    this.gameBoard = document.getElementById('game-board')
  }

  setCurrentPlayer(player) {
    this.currentPlayer = player;
  }

  createGameBoard(board) {
    if (!this.isBoardCreated) {
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
      this.isBoardCreated = true
    }
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

    for (let i = 1; i <= bomb.radius; i++) {
      if (keepUpDirection) {
        keepUpDirection = this.explodeInDirection(bomb.position.x, bomb.position.y - i); // Up
        if (keepUpDirection) {
          verticalBlast.style.opacity = "1"
          verticalBlast.style.top = `-${i * 100}%`
        }
      }
      if (keepDownDirection) {
        keepDownDirection = this.explodeInDirection(bomb.position.x, bomb.position.y + i); // Down
        if (keepDownDirection) {
          verticalBlast.style.opacity = "1"
          verticalBlast.style.bottom = `-${i * 100}%`
        }
      }
      if (keepLeftDirection) {
        keepLeftDirection = this.explodeInDirection(bomb.position.x - i, bomb.position.y); // Left
        if (keepLeftDirection) {
          horizontalBlast.style.opacity = "1"
          horizontalBlast.style.left = `-${i * 100}%`
        }
      }
      if (keepRightDirection) {
        keepRightDirection = this.explodeInDirection(bomb.position.x + i, bomb.position.y); // Right
        if (keepRightDirection) {
          horizontalBlast.style.opacity = "1"
          horizontalBlast.style.right = `-${i * 100}%`
        }
      }
    }

    setTimeout(() => {
      this.gameBoard.removeChild(element);
    }, 255);
    console.log('BOMB DAMAGED PLAYER(S):', bomb.damagedPlayer);
    // TODO: TRIGGER DAMAGE ANIMATION FOR PLAYER(S) DAMAGED BY BOMB
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
  
        // Arrêter le clignotement après 5 secondes (ou toute autre durée souhaitée)
        setTimeout(() => {
          clearInterval(blinkInterval);
          playerElement.style.visibility = "visible"; // Assurez-vous que le joueur soit visible à la fin du clignotement
        }, 3000); // 5 secondes
        updatePlayerLives(player.id, player.numberOfLife)
      });
    }
    
  }

  explodeInDirection(x, y) {
    const isDestroyWall = destroyWall(x, y);
    // if (isDestroyWall === 1) {
    //   this.damageScore += 10
    // }
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
        case " ":
          senAddBomb();
          break;
      }
    });
  }
}

export function destroyWall(x, y) {
  const cell = document.getElementById(`c-${y}-${x}`);
  console.log(cell);
  if (cell && cell.classList.contains("wall")) {
    cell.classList.add("explode");
    setTimeout(() => {
      const powerUp = cell.getAttribute("data-power")
      console.log(x, y, powerUp);
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
