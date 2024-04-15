export default class SocketHandler {
  constructor(game) {
    this.game = game
    this.ws = window.ws || null;
    this.game.playAccess = window.access
    this.ws.addEventListener('error', function (event) {
      console.error('WebSocket error:', event);
    });
    // bind this for all methods with a loop
    for (let key of Object.getOwnPropertyNames(Object.getPrototypeOf(this))) {
      if (typeof this[key] === 'function') {
        this[key] = this[key].bind(this);
      }
    }
    this.ws.addEventListener('message', this.handleMessage);
  }

  handleMessage(event) {
    const message = JSON.parse(event.data);
    const type = message.type;

    console.log('Received from server:', type, message.payload);
    switch (type) {
      case 'init-game':
        if (!this.game.initGame) {
          const board = message.payload.board;
          const players = message.payload.players;
          const currentId = message.payload.currentId;
          this.game.createGameBoard(board);
          this.game.placePlayer(players);
          this.game.handleKeyPress(this.sendPlayerMove, this.sendAddBomb);
          this.game.setCurrentPlayer(currentId);
          this.game.initGame = true;
        }
        break;
      case 'player-move':
        const id = message.payload.id;
        const position = message.payload.position;
        const direction = message.payload.direction;
        const nbrLife = message.payload.nbrLife;
        const toRemove = message.payload.toRemove;

        if (position) {
          this.game.movePlayer(id, position, direction, nbrLife, toRemove);
        }
        break;
      case 'add-bomb':
        const bomb = message.payload;
        this.game.addBomb(bomb);
        break;
      case 'explode-bomb':
        const bombToExplode = message.payload;
        this.game.explodeBomb(bombToExplode);
        break;
      case 'game-over':
        const gameOverInfos = message.payload;
        this.game.gameOver(gameOverInfos);
      default:
        break;
    }
  }

  sendAddBomb() {
    this.ws.send(JSON.stringify({
      type: 'add-bomb',
      payload: {
        access: this.game.playAccess
      }
    }));
  }

  sendPlayerMove(direction) {
    this.ws.send(JSON.stringify({
      type: 'player-move',
      payload: {
        access: this.game.playAccess,
        direction
      }
    }));
  }

  sendPlayerNickname(nickname) {
    this.ws.send(JSON.stringify({
      type: 'create-player',
      payload: {
        access: this.game.playAccess,
        nickname
      }
    }));
  }

  startGame() {
    this.ws.send(JSON.stringify({
      type: 'start-game',
      payload: {
        access: this.game.playAccess,
      }
    }));
  }
}

/// JUST FOR DEV MODE
const JustForDevMode = () => {
  document.getElementById('nickname').value = 'Player' + Math.floor(Math.random() * 1000);
  document.getElementById('btn-connect').click();
  setTimeout(() => {
    document.getElementById('btn-start').click();
  }, 1000);
}