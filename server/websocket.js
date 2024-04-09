import WebSocket, { WebSocketServer } from 'ws';
import { uuid } from './utils/helper.js';

export default class SocketHandler {
  constructor(game) {
    this.game = game
    this.wss = new WebSocketServer({ port: 8080 });
    this.onConnection = this.onConnection.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.CreateNewUser = this.createNewPlayer.bind(this);
    this.clients = new Map();
    this.wss.on('connection', this.onConnection);
  }

  onConnection(ws) {
    console.log("Client connected");
    const id = uuid();
    this.clients.set(id, ws);
    ws.on('message', this.handleMessage);
    ws.send(JSON.stringify({
      type: "connection-success",
      payload: { access: id }
    }));
  }

  handleMessage(_message) {
    const message = JSON.parse(_message);
    console.log('Received from client:', message.payload);

    const type = message.type;
    switch (type) {
      case "create-player":
        this.createNewPlayer(message);
        break;
      case "start-game":
        this.initGame(message);
        break;
      case 'player-move':
        this.movePlayer(message);
        break;
      case 'add-bomb':
        this.addBomb(message);
        break;
      default:
        break;
    }
  }

  createNewPlayer(message) {
    console.log('Create User:');
    const access = message.payload.access;
    const nickname = message.payload.nickname;
    const client = this.clients.get(access)
    if (client) {
      const player = this.game.addPlayer(access, nickname);
      client.send(JSON.stringify({
        type: 'create-player-success',
        payload: player
      }));
    }
  }

  movePlayer(message) {
    const access = message.payload.access;
    const direction = message.payload.direction;
    const client = this.clients.get(access);
    if (client) {
      const { position, id } = this.game.movePlayer(access, direction);
      if (position) {
        this.clients.forEach((c) => {
          c.send(JSON.stringify({
            type: 'player-move',
            payload: {
              id,
              position,
              direction
            }
          }));
        });
      }
    }
  }

  addBomb(message) {
    const access = message.payload.access;
    const client = this.clients.get(access);
    if (client) {
      const bomb = this.game.addBomb(access, this.explodeBomb.bind(this));
      if (bomb) {
        this.clients.forEach((c) => {
          c.send(JSON.stringify({
            type: 'add-bomb',
            payload: {
              ...bomb
            }
          }));
        });
      }
    }
  }

  explodeBomb(bomb, position) {
    this.clients.forEach((c) => {
      c.send(JSON.stringify({
        type: 'explode-bomb',
        payload: {
          id: bomb.id,
          radius: bomb.explosionRadius,
          position,
          affectedplayer: bomb.affectedplayer
        }
      }));
    });
  }

  initGame(message) {
    const access = message.payload.access;
    const client = this.clients.get(access);
    if (client) {
      console.log('Game is started');
      this.clients.forEach((c) => {
        c.send(JSON.stringify({
          type: 'init-game',
          payload: {
            board: this.game.board(),
            players: this.game.players()
          }
        }));
      });
    }
  }

  runGame() {
    this.game.startGameLoop();
  }
}
