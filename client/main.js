import { board, gameBoard } from "../server/core/game.js";
import Player from "../shared/models/player.js";
const ws = new WebSocket('ws://localhost:8080');
// const players = [];
const createPlayers = () => {

  const player1 = new Player(1,'Player 1', 2, 2); 
  // const player2 = new Player(2,'Player 2', 2, 15);
  // players.push(player1); 
  // players.push(player2); 
 
  // players.forEach(player => {
     const playerElement = document.createElement('div');
     playerElement.classList.add('player');
     playerElement.style.gridRowStart = player1.y;
     playerElement.style.gridColumnStart = player1.x;
     gameBoard.appendChild(playerElement);
  // });
};

ws.addEventListener('open', function () {
  console.log('Connected to server');
});

ws.addEventListener('message', function (event) {
  console.log('Received from server:', event.data);

  let message = JSON.parse(event.data);

  // if (message.type === 'create-successfully') {
  //    const newPlayer = message.payload;
  //    console.log(newPlayer);
  //    const player3 = new Player(newPlayer.id, newPlayer.nickname, 15, 15); 
  //    players.push(player3)
  //    window.location.href='game.html'
     
  // }
});

ws.addEventListener('error', function (event) {
  console.error('WebSocket error:', event);
});

const connect = () => {
  let nickname = document.getElementById("nickname")
  ws.send(JSON.stringify({
    type: 'new-user',
    payload: nickname.value
  }))
}
if (document.getElementById("connect")) {
  document.getElementById("connect").addEventListener("click", connect)
}

const GRID_SIZE = 16

export function createGameBoard() {
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

  gameBoard.appendChild(fragment);
}


document.addEventListener('DOMContentLoaded', function() {
  createGameBoard();
  createPlayers();
});
