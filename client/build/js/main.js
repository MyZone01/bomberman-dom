import SocketHandler from "./websocket.js";
import Game from "./game.js";

const game = new Game();
const ws = new SocketHandler(game);
window.game = game;

ws.startGame();



