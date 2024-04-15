import WebSocket, { WebSocketServer } from "ws";
import { uuid } from "./utils/helper.js";
import PlayersManager from "./core/playerManager.js";
import { MAX_PLAYERS, SERVER_PORT, STARTING_TIME, WAITING_TIME } from "../shared/constants.js";

export default class SocketHandler {
  constructor(game) {
    this.game = game;
    this.messages = [];
    this.timer = WAITING_TIME;
    this.currentId = 0;
    this.initialTimer = true
    this.starGame = false

    this.clients = new Map();
    this.PlayersManage = new PlayersManager();
    this.wss = new WebSocketServer({ port: SERVER_PORT });
    this.onConnection = this.onConnection.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.CreateNewUser = this.createNewPlayer.bind(this);
    this.wss.on("connection", this.onConnection);
  }

  onConnection(ws) {
    if (this.game.numberOfPlayer >= MAX_PLAYERS) {
      this.sendMessage(
        ws,
        "only 4 user in authorize to play game",
        "not-authorize"
      );
      return;
    }
    if (this.starGame) {
      this.sendMessage(
        ws,
        "Game already start",
        "not-authorize"
      );
      return
    }

    const id = uuid();
    this.clients.set(id, ws);
    this.currentId = id;
    ws.on("message", this.handleMessage);
  }

  handleMessage(_message) {
    const message = JSON.parse(_message);
    const type = message.type;
    switch (type) {
      case "create-player":
        this.createNewPlayer(message);
        break;
      case "start-game":
        this.initGame(message);
        break;
      case "player-move":
        this.movePlayer(message);
        break;
      case "add-bomb":
        this.addBomb(message);
        break;
      case "chat":
        this.chat(message.payload);
        break;
      default:
        break;
    }
  }

  createNewPlayer(message) {
    console.log("Create User:", message);
    const access = message.payload.access || this.currentId;;
    const nickname = message.payload.nickname
    const emoji = message.payload.emoji;
    const client = this.clients.get(this.currentId);
    if (client) {
      const player = this.game.addPlayer(access, nickname, emoji);
      this.register(message, client, player);
      return;
    }
  }

  movePlayer(message) {
    const access = message.payload.access;
    const direction = message.payload.direction;
    const client = this.clients.get(access);
    if (client) {
      const { position, id, nbrLife, toRemove } = this.game.movePlayer(access, direction);
      if (position) {
        this.clients.forEach((c) => {
          c.send(JSON.stringify({
            type: 'player-move',
            payload: {
              id,
              position,
              direction,
              nbrLife,
              toRemove
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
          c.send(
            JSON.stringify({
              type: "add-bomb",
              payload: {
                ...bomb,
              },
            })
          );
        });
      }
    }
  }

  explodeBomb(bomb,) {
    this.clients.forEach((c) => {
      c.send(
        JSON.stringify({
          type: "explode-bomb",
          payload: bomb,
        })
      );
    });
  }

  initGame(message) {
    const access = message.payload.access;
    const client = this.clients.get(access);
    if (client) {
      this.clients.forEach((c) => {
        c.send(
          JSON.stringify({
            type: "init-game",
            payload: {
              board: this.game.board(),
              players: this.game.players(),
            },
          })
        );
      });
    }
  }

  runGame() {
    this.game.startGameLoop();
  }

  register(message, ws, player) {
    const newPlayer = message.payload;
    if (this.PlayersManage.getPlayerByName(newPlayer?.nickname)) {
      this.sendMessage(
        ws,
        "username already exist. Chose an other",
        "not-authorize"
      );
      return;
    }

    this.PlayersManage.addPlayer(player);
    this.sendMessage(ws, { id: this.currentId }, "create-successfully");

    this.clients.forEach((client) => {
      this.sendMessage(
        client,
        { players: this.PlayersManage.players },
        "new-player"
      );
    });
    this.timerStart()
  }

  sendMessage(ws, messages, type) {
    ws.send(
      JSON.stringify({
        type,
        payload: messages,
      })
    );
  }

  chat(data) {
    let player = this.PlayersManage.getPlayerByAccess(data.userId);
    let message = { content: data.content, player };
    this.messages.push(message);
    this.clients.forEach((client) => {
      this.sendMessage(client, { messages: this.messages }, "chat");
    });
  }

  timerStart() {
    if (this.initialTimer && this.game.numberOfPlayer > 1) {
      let intervalTimer = setInterval(() => {
        if (this.game.numberOfPlayer >= 4 && !this.starGame) {
          this.timer = STARTING_TIME
          this.starGame = true
        }
        if (this.timer < 0 && this.game.numberOfPlayer < MAX_PLAYERS && !this.starGame) {
          this.timer = STARTING_TIME
          this.starGame = true
        }
        if (this.timer < 0) {
          clearInterval(intervalTimer)
          //  start the game
          this.clients.forEach((client) => {
            this.sendMessage(client, { timer: this.timer }, "ready-init-game");
          });
          return
        }

        this.clients.forEach((client) => {
          this.sendMessage(client, { timer: this.timer }, "timer");
        });

        this.timer--
      }, 1000)
      this.initialTimer = false
    }
  }
}
