import { Player } from "../shared/models/index.js";
import { uuid } from "./utils/helper.js";
import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  ws.on('message', function incoming(_message) {
    const message = JSON.parse(_message);
    console.log('Received:', message);

    const type = message.type;
    switch (type) {
      case "new-user":
        const nickname = message.payload
        const id = uuid()
        const player = new Player(id, nickname)
        ws.send(JSON.stringify({
          type: 'create-successfully',
          payload: player
        }))
        break;

      default:
        break;
    }
  });

  ws.send('Hello, Player!');
});
