export default class SocketHandler {
  constructor(game) {
    const self = this;
    this.game = game
    this.ws = new WebSocket('ws://localhost:8080');
    this.ws.addEventListener('open', function () {
      console.log('Connected to server');
      self.loadBoard();
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
      case 'send-player':
        console.log('Player:', message.payload);
        break;
      case 'send-board':
        console.log('Board:', message.payload);
        this.game.board = message.payload;
        this.game.createGameBoard();
        // createGameBoard()
        break;
      default:
        break;
    }
  }

  sendPlayerNickname(nickname) {
    this.ws.send(JSON.stringify({
      type: 'new-user',
      payload: nickname
    }));
  }

  loadBoard() {
    this.ws.send(JSON.stringify({
      type: 'load-board'
    }));
  }
}