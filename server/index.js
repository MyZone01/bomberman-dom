import { Player } from "../shared/models/index.js";
import { PlayersManager } from "./core/playerManager.js";
import { uuid } from "./utils/helper.js";
import WebSocket, { WebSocketServer } from 'ws';

let PlayersManage= new PlayersManager()

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  ws.on('message', function incoming(_message) {
    const message = JSON.parse(_message);
    console.log('Received:', message);

    const type = message.type;
    switch (type) {
      case "new-user":
        Register(message, ws);
        break;

      default:
        break;
    }
  });


});

function Register(message, ws) {
  const newPlayer = message.payload;
  if (PlayersManage.players.length>=4) {
    sendMessage(ws,"only 4 user in authorise to play game","not-authorise")
    return
  }
  if (PlayersManage.getPlayerByname(newPlayer?.name)) {
    sendMessage(ws,"Only 4 users are authorized to play the game","not-authorise")
    return
  }
  const id = uuid();
  const player = new Player(id, newPlayer.name, newPlayer.emoji);
  PlayersManage.addPlayer(player);
  sendMessage(ws,PlayersManage.players,'create-successfully');
  console.log("list de player ", PlayersManage);
}

function sendMessage(ws , messages,type) {
  ws.send(JSON.stringify({
    type,
    payload: messages
  }));
}

