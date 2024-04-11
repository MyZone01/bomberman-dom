
import { register ,chat, sendMessage} from "./websocket.js";
import { PlayersManager} from "./core/playerManager.js";
import WebSocket, { WebSocketServer } from 'ws';

let PlayersManage= new PlayersManager()
let Messages=[]
let timer=20

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws) {
  console.log('Client connected');

  ws.on('message', function incoming(_message) {
    const message = JSON.parse(_message);
    // console.log('Received:', message);
    const type = message.type;
    switch (type) {
      case "new-user":
          register(message, ws,PlayersManage);
          wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {     // check if client is ready
              sendMessage(client,{players:PlayersManage.players},"new-player")
            }
          })
          sendMessage(ws,{messages:Messages},"chat")
        break;
      case "chat":
        let player=PlayersManage.getPlayerById(message.payload.userId)
        Messages.push(chat(ws,message?.payload,player)) 
        wss.clients.forEach(function each(client) {
          if (client.readyState === WebSocket.OPEN) {     // check if client is ready
            sendMessage(client,{messages:Messages},"chat")
          }
        })
        console.log("new message ",Messages,player);
        break 
      default:
        break;
    }
  });
 let intervalTimer= setInterval(()=>{
   if (timer<=1) {
     clearInterval(intervalTimer)
    //  start the game
    return
   }
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {     // check if client is ready
        sendMessage(client,{timer:timer},"timer")
      }
    })
    timer--
  },1000)

});


