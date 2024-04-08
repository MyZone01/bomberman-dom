import SocketHandler from "./core/websocket.js";
import Game from "./core/game.js";

const game = new Game();
const ws = new SocketHandler(game);
window.game = game;
window.ws = ws;

const connectPlayer = () => {
  let nickname = document.getElementById("nickname")
  ws.sendPlayerNickname(nickname.value);
}

const startGame = () => {
  ws.startGame();
}

document.getElementById("btn-connect")?.addEventListener("click", connectPlayer);
document.getElementById("btn-start")?.addEventListener("click", startGame);
