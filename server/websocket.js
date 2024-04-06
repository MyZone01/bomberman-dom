import { Player } from "../shared/models/index.js";
import { uuid } from "./utils/helper.js";
import WebSocket, { WebSocketServer } from 'ws';

export default class SocketHandler {
  constructor(game) {
    this.game = game
    this.wss = new WebSocketServer({ port: 8080 });
    this.onConnection = this.onConnection.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.CreateNewUser = this.createNewUser.bind(this);
    this.wss.on('connection', this.onConnection);
  }

  onConnection(ws) {
    console.log("Client connected");
    this.ws = ws;
    this.ws.on('message', this.handleMessage);
    this.ws.send(JSON.stringify({
      type: "message",
      payload: "Hello, Player!"
    }));
  }

  handleMessage(_message) {
    const message = JSON.parse(_message);
    console.log('Received from client:', message.payload);

    const type = message.type;
    switch (type) {
      case "new-user":
        this.createNewUser(message);
        break;
      case "load-board":
        this.initGame();
        break;
      default:
        break;
    }
  }

  createNewUser(message) {
    console.log('Create User:');
    const nickname = message.payload;
    const id = uuid();
    const player = new Player(id, nickname);
    this.ws.send(JSON.stringify({
      type: 'send-player',
      payload: player
    }));
  }

  initGame() {
    console.log('Game is started');
    this.ws.send(JSON.stringify({
      type: 'send-board',
      payload: this.game.board()
    }));
  }
}