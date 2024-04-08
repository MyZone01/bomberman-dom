export default class SocketHandler {
  constructor(game, callback) {
    this.game = game
    this.ws = new WebSocket('ws://localhost:8080');
    this.ws.addEventListener('open', function () {
      console.log('Connected to server');
    });
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
    console.log('Received from server:', message.payload);
    console.log(message);
    const type = message.type;
    switch (type) {
      case "connection-success":
        this.game.playAccess = message.payload.access;
        JustForDevMode();
        break;
      case 'create-player-success':
        const player = message.payload;
        this.game.setCurrentPlayer(player);
        break;
      case 'init-game':
        const board = message.payload.board;
        const players = message.payload.players;
        this.game.createGameBoard(board);
        this.game.placePlayer(players);
        this.game.handleKeyPress(this.sendPlayerMove);
        break;
      case 'player-move':
        const id = message.payload.id;
        const position = message.payload.position;
        const direction = message.payload.direction;

        if (position) {
          this.game.movePlayer(id, position, direction);
        }
        break;
      default:
        break;
    }
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