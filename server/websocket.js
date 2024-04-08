import { Player } from "../shared/models/index.js";

export function register(message, ws, PlayersManage) {
    const newPlayer = message.payload;
    if (PlayersManage.players.length>=4) {
      sendMessage(ws,"only 4 user in authorise to play game","not-authorise")
      return
    }
    if (PlayersManage.getPlayerByname(newPlayer?.name)) {
      sendMessage(ws,"Only 4 users are authorized to play the game","not-authorise")
      return
    }
    const id = crypto.randomUUID();
    const player = new Player(id, newPlayer.name, newPlayer.emoji);
    PlayersManage.addPlayer(player);
    sendMessage(ws,{id},'create-successfully');
    console.log("list de player ", PlayersManage);
  }
  
  export function chat(ws,data,player){
    let message={content:data.content, player}
    sendMessage(ws,message,"chat")
    return message
  }
  
  export function sendMessage(ws , messages,type) {
    ws.send(JSON.stringify({
      type,
      payload: messages
    }));
  }