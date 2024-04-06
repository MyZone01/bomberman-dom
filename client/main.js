import SocketHandler from "./core/websocket.js";
import Game from "./core/game.js";

const game = new Game();
const ws = new SocketHandler(game);

const connect = () => {
  let nickname = document.getElementById("nickname")
  ws.sendPlayerNickname(nickname.value);
}


document.getElementById("btn-connect").addEventListener("click", connect);
