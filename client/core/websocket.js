export default class SocketHandler {
  constructor(game) {
    const self = this;
    this.game = game
    this.ws = new WebSocket('ws://localhost:8080');
    this.ws.addEventListener('open', function () {
      console.log('Connected to server');
    });
    this.ws.addEventListener('error', function (event) {
      console.error('WebSocket error:', event);
    });
    this.handleMessage = this.handleMessage.bind(this);
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
        break;
      default:
        break;
    }
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