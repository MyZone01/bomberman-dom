import WebSocket, { WebSocketServer } from "ws";
import { uuid } from "./utils/helper.js";
import PlayersManager from "./core/playerManager.js";

export default class SocketHandler {
  constructor(game) {
    this.game = game;
    this.clients = new Map();
    this.PlayersManage = new PlayersManager();
    this.messages = [];
    this.timer = 20;
    this.currenid = 0;
    this.wss = new WebSocketServer({ port: 8080 });
    this.onConnection = this.onConnection.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.CreateNewUser = this.createNewPlayer.bind(this);
    this.wss.on("connection", this.onConnection);
  }

  async onConnection(ws) {
    console.log("Client connected");
    const id = uuid();
    this.clients.set(id, ws);
    this.currenid = id;
    await ws.on("message", this.handleMessage);
    // ws.send(JSON.stringify({
    //   type: "create-successfully",
    //   payload: { access: id }
    // }));

    // let intervalTimer= setInterval(()=>{
    //   if (this.timer<0) {
    //      clearInterval(intervalTimer)
    //      //  start the game
    //      return
    //    }
    //     // check if client is ready
    //     this.sendMessage(ws,{timer:this.timer},"timer")
    //    this.timer--
    //  },1000)
  }

  handleMessage(_message) {
    const message = JSON.parse(_message);
    console.log("Received from client:", message.payload);
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
        console.log("new message");
        this.chat(message.payload);
        break;
      default:
        break;
    }
  }
  createNewPlayer(message) {
    console.log("Create User:", message);
    const access = message.payload.access;
    const nickname = message.payload.nickname || this.currenid;
    const emoji = message.payload.emoji;
    const client = this.clients.get(this.currenid);
    if (client) {
      const player = this.game.addPlayer(access, nickname, emoji);
      this.register(message, client, player);
      // client.send(JSON.stringify({
      //     type: 'create-player-success',
      //     payload: player
      // }));
      return;
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
          c.send(
            JSON.stringify({
              type: "player-move",
              payload: {
                id,
                position,
                direction,
              },
            })
          );
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

  explodeBomb(bomb, position) {
    this.clients.forEach((c) => {
      c.send(
        JSON.stringify({
          type: "explode-bomb",
          payload: {
            id: bomb.id,
            radius: bomb.explosionRadius,
            position,
            damagedPlayer: bomb.damagedPlayer,
          },
        })
      );
    });
  }

  initGame(message) {
    const access = message.payload.access;
    const client = this.clients.get(access);
    if (client) {
      console.log("Game is started");
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
    if (this.PlayersManage.players.length >= 4) {
      this.sendMessage(
        ws,
        "only 4 user in authorise to play game",
        "not-authorise"
      );
      return;
    }
    if (this.PlayersManage.getPlayerByname(newPlayer?.name)) {
      this.sendMessage(
        ws,
        "username alredy existe. Chose an other",
        "not-authorise"
      );
      return;
    }

    // const id = crypto.randomUUID();
    // const player = new Player(id, newPlayer.name, newPlayer.emoji);
    this.PlayersManage.addPlayer(player);
    console.log("list of player", player);
    this.sendMessage(ws, { id: this.currenid }, "create-successfully");

    this.clients.forEach((client) => {
      this.sendMessage(
        client,
        { players: this.PlayersManage.players },
        "new-player"
      );
    });
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
    let player = this.PlayersManage.getPlayerById(data.userId);
    let message = { content: data.content, player };
    this.messages.push(message);
    console.log(this.messages);
    this.clients.forEach((client) => {
      this.sendMessage(client, message, "chat");
    });
  }
}
