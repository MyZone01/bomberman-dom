import BoardManager from "./boardManager.js";

export default class Game {
  constructor() {
    this.boardManager = new BoardManager();
  }

  board() {
    return this.boardManager.board
  }
}