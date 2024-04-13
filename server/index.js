import SocketHandler from "./websocket.js";
import Game from "./core/game.js";

const game = new Game();
const socketHandler = new SocketHandler(game);
