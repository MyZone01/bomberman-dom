import BoardManager from "./boardManager.js";
import PlayerManager from "./playerManager.js";
import Player from "../../shared/models/player.js";

const playerDefaultPosition = [
  { x: 2, y: 2 },
  { x: 16, y: 2 },
  { x: 2, y: 16 },
  { x: 16, y: 16 }
];

export default class Game {
  constructor() {
    this.numberOfPlayer = 0
    this.playerManager = new PlayerManager();
    this.boardManager = new BoardManager();
  }

  board() {
    return this.boardManager.board
  }

  addPlayer(access, nickname) {
    const id = 'player-' + this.numberOfPlayer;
    const position = playerDefaultPosition[this.numberOfPlayer];
    const avatar = ['😆', '🤢', '😡', '🥶'][this.numberOfPlayer];
    this.numberOfPlayer++;
    const player = new Player(id, access, nickname, position, avatar);
    this.playerManager.addPlayer(player)
    return player;
  }

  players() {
    return this.playerManager.players.map((player, i) => {
      return {
        id: player.id,
        avatar: player.avatar,
        position: player.position
      }
    });
  }
}